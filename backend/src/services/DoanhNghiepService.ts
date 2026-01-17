import { DoanhNghiep } from '../models/DoanhNghiep';
import { HoSo } from '../models/HoSo';
import { Op } from 'sequelize';
import slug from 'slug';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class DoanhNghiepService {
  async create(data: any) {
    const existing = await DoanhNghiep.findOne({ where: { ma_so_doanh_nghiep: data.ma_so_doanh_nghiep } });
    if (existing) {
      throw new Error('Mã số doanh nghiệp đã tồn tại');
    }
    return await DoanhNghiep.create(data);
  }

  async getById(id: string) {
    return await DoanhNghiep.findByPk(id, { include: [HoSo] });
  }

  async getByMaSo(maSo: string) {
    return await DoanhNghiep.findOne({ where: { ma_so_doanh_nghiep: maSo } });
  }

  async list(page: number, limit: number, tenVI?: string, tenEN?: string, vietTat?: string, maSo?: string) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (tenVI) where.ten_doanh_nghiep_vi = { [Op.like]: `%${tenVI}%` };
    if (tenEN) where.ten_doanh_nghiep_en = { [Op.like]: `%${tenEN}%` };
    if (vietTat) where.ten_viet_tat = { [Op.like]: `%${vietTat}%` };
    if (maSo) where.ma_so_doanh_nghiep = { [Op.like]: `%${maSo}%` };

    const { rows, count } = await DoanhNghiep.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [HoSo],
    });

    return { data: rows, total: count };
  }

  async update(id: string, data: any) {
    const dn = await DoanhNghiep.findByPk(id);
    if (!dn) throw new Error('Không tìm thấy doanh nghiệp');
    return await dn.update(data);
  }

  async changeMSDN(id: string, input: { ma_so_doanh_nghiep_moi: string; ngay_thay_doi: Date; noi_cap_moi: string }) {
    const dn = await DoanhNghiep.findByPk(id);
    if (!dn) throw new Error('Không tìm thấy doanh nghiệp');

    if (input.ma_so_doanh_nghiep_moi !== dn.ma_so_doanh_nghiep) {
      const existing = await DoanhNghiep.findOne({ where: { ma_so_doanh_nghiep: input.ma_so_doanh_nghiep_moi } });
      if (existing) throw new Error('Mã số doanh nghiệp mới đã tồn tại');
    }

    const soLanMoi = (dn.so_lan_thay_doi_msdn || 0) + 1;

    return await dn.update({
      ma_so_doanh_nghiep: input.ma_so_doanh_nghiep_moi,
      ngay_thay_doi_msdn: input.ngay_thay_doi,
      noi_cap_msdn: input.noi_cap_moi,
      so_lan_thay_doi_msdn: soLanMoi,
    });
  }

  async delete(id: string) {
    const dn = await DoanhNghiep.findByPk(id);
    if (!dn) throw new Error('Không tìm thấy doanh nghiệp');
    return await dn.destroy();
  }

  async uploadGCN(id: string, file: Express.Multer.File) {
    const dn = await DoanhNghiep.findByPk(id);
    if (!dn) throw new Error('Không tìm thấy doanh nghiệp');

    const slugName = slug(dn.ten_doanh_nghiep_vi, { replacement: '_' });
    const fileExt = path.extname(file.originalname).toLowerCase();
    const newFilename = `${id}_${slugName}${fileExt}`;

    const storageDir = path.join(__dirname, '../../uploads/gcn', id);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const fullPath = path.join(storageDir, newFilename);
    fs.writeFileSync(fullPath, file.buffer);

    const dbPath = path.join('uploads', 'gcn', id, newFilename).replace(/\\/g, '/');

    return await dn.update({ file_gcndkdn: dbPath });
  }

  async getGCNFilePath(id: string) {
    const dn = await DoanhNghiep.findByPk(id);
    if (!dn || !dn.file_gcndkdn) throw new Error('File giấy chứng nhận chưa được upload');
    return dn.file_gcndkdn;
  }
}
