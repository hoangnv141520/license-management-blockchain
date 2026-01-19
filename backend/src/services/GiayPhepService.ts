import { GiayPhep } from '../models/GiayPhep';
import { HoSo } from '../models/HoSo';
import { DoanhNghiep } from '../models/DoanhNghiep';
import { FabricClient } from '../config/fabric';
import { calculateDataHash, calculateFileHash } from '../utils/helper';
import { Op } from 'sequelize';
import * as path from 'path';
import * as fs from 'fs';

export class GiayPhepService {
  private fabricClient: FabricClient;

  constructor(fabricClient: FabricClient) {
    this.fabricClient = fabricClient;
  }

  async create(data: any) {
    const exists = await GiayPhep.findOne({ where: { ho_so_id: data.ho_so_id } });
    if (exists) throw new Error('Hồ sơ đã được cấp giấy phép');

    const h1Hash = calculateDataHash(
      data.ho_so_id,
      data.loai_giay_phep,
      data.so_giay_phep,
      new Date(data.ngay_hieu_luc).toISOString(),
      new Date(data.ngay_het_han).toISOString(),
      data.trang_thai_giay_phep
    );

    try {
      const gp = await GiayPhep.create({
        ...data,
        h1_hash: h1Hash,
        trang_thai_blockchain: 'ChuaDongBo',
      });
      return await this.getById(gp.id);
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`Số giấy phép '${data.so_giay_phep}' đã tồn tại`);
      }
      throw error;
    }
  }

  async getById(id: string) {
    return await GiayPhep.findByPk(id, {
      include: [
        {
          model: HoSo,
          include: [DoanhNghiep],
        },
      ],
    });
  }

  async update(id: string, data: any) {
    const gp = await GiayPhep.findByPk(id);
    if (!gp) throw new Error('Không tìm thấy giấy phép');

    const h1Hash = calculateDataHash(
      gp.ho_so_id, // HoSoID doesn't change
      data.loai_giay_phep,
      data.so_giay_phep,
      new Date(data.ngay_hieu_luc).toISOString(),
      new Date(data.ngay_het_han).toISOString(),
      data.trang_thai_giay_phep
    );

    return await gp.update({ ...data, h1_hash: h1Hash });
  }

  async delete(id: string) {
    const gp = await GiayPhep.findByPk(id);
    if (!gp) throw new Error('Không tìm thấy giấy phép');

    if (gp.trang_thai_giay_phep === 'HieuLuc' || gp.trang_thai_giay_phep === 'SapHetHan') {
      throw new Error('Giấy phép đang có hiệu lực, không thể xóa');
    }

    if (gp.file_duong_dan) {
      const physicalPath = path.join(__dirname, '../../', gp.file_duong_dan);
      if (fs.existsSync(physicalPath)) {
        fs.unlinkSync(physicalPath);
        const dir = path.dirname(physicalPath);
        if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
      }
    }

    return await gp.destroy();
  }

  async list(page: number, limit: number, doanhNghiepId: string, params: any) {
    const offset = (page - 1) * limit;

    // Complex query with associations
    const where: any = {};
    const hoSoWhere: any = {};

    if (doanhNghiepId) hoSoWhere.doanh_nghiep_id = doanhNghiepId;
    if (params.ma_ho_so) hoSoWhere.ma_ho_so = { [Op.iLike]: `%${params.ma_ho_so}%` };

    if (params.so_giay_phep) where.so_giay_phep = { [Op.iLike]: `%${params.so_giay_phep}%` };
    if (params.loai_giay_phep) where.loai_giay_phep = params.loai_giay_phep;
    if (params.trang_thai_giay_phep) where.trang_thai_giay_phep = params.trang_thai_giay_phep;

    // Date filters... (similar to HoSoService)

    const { rows, count } = await GiayPhep.findAndCountAll({
      where,
      include: [
        {
          model: HoSo,
          where: hoSoWhere,
          include: [DoanhNghiep]
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return { data: rows, total: count };
  }

  async uploadFile(id: string, file: Express.Multer.File) {
    const gp = await GiayPhep.findByPk(id);
    if (!gp) throw new Error('Không tìm thấy giấy phép');

    const h2Hash = await calculateFileHash(file.path);

    const uniqueName = path.basename(file.filename);
    const finalDir = path.join(__dirname, '../../uploads/giay_phep', id);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

    const finalPath = path.join(finalDir, uniqueName);
    fs.renameSync(file.path, finalPath);

    if (gp.file_duong_dan) {
      const oldPath = path.join(__dirname, '../../', gp.file_duong_dan);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const dbPath = path.join('uploads', 'giay_phep', id, uniqueName).replace(/\\/g, '/');

    return await gp.update({
      file_duong_dan: dbPath,
      h2_hash: h2Hash
    });
  }

  async pushToBlockchain(id: string) {
    const gp = await GiayPhep.findByPk(id);
    if (!gp) throw new Error('Không tìm thấy giấy phép');

    if (!gp.h1_hash || !gp.h2_hash) throw new Error('Giấy phép thiếu h1 hoặc h2 hash');
    if (gp.trang_thai_blockchain === 'DaDongBo') throw new Error('Giấy phép đã được đồng bộ');

    if (!this.fabricClient.getContract()) throw new Error('Dịch vụ blockchain không khả dụng');

    try {
      await this.fabricClient.submitTransaction('SubmitLisence', gp.id, gp.h1_hash, gp.h2_hash);
      return await gp.update({ trang_thai_blockchain: 'DaDongBo' });
    } catch (error) {
      await gp.update({ trang_thai_blockchain: 'LoiDongBo' });
      throw error;
    }
  }

  async verify(id: string) {
    const gp = await GiayPhep.findByPk(id);
    if (!gp) throw new Error('Không tìm thấy giấy phép');

    const response: any = {
      giay_phep_id: gp.id,
      h1_hash_db: gp.h1_hash,
      h2_hash_db: gp.h2_hash,
    };

    if (!this.fabricClient.getContract()) {
      throw new Error('Dịch vụ blockchain không khả dụng');
    }

    try {
      const resultBuffer = await this.fabricClient.evaluateTransaction('QueryLisence', gp.id);
      const assetBC = JSON.parse(resultBuffer.toString());

      response.h1_hash_bc = assetBC.h1Hash;
      response.h2_hash_bc = assetBC.h2Hash;

      response.is_h1_matched = response.h1_hash_db === response.h1_hash_bc;
      response.is_h2_matched = response.h2_hash_db === response.h2_hash_bc;

      response.message = (response.is_h1_matched && response.is_h2_matched)
        ? "Xác thực thành công!"
        : "XÁC THỰC THẤT BẠI!";

      if (response.is_h1_matched && response.is_h2_matched) {
        response.giay_phep_data = gp;
      }

      return response;

    } catch (error) {
      throw new Error('Asset không tồn tại trên blockchain hoặc lỗi query');
    }
  }
}
