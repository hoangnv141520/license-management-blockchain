import { HoSo } from '../models/HoSo';
import { DoanhNghiep } from '../models/DoanhNghiep';
import { LoaiTaiLieu } from '../models/LoaiTaiLieu';
import { HoSoTaiLieu } from '../models/HoSoTaiLieu';
import { TaiLieu } from '../models/TaiLieu';
import { GiayPhep } from '../models/GiayPhep';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class HoSoService {
  private getRequiredTaiLieu(loaiThuTuc: string): string[] {
    switch (loaiThuTuc) {
      case 'Cấp mới Giấy phép kinh doanh':
        return [
          'Đơn đề nghị cấp Giấy phép kinh doanh',
          'Giấy chứng nhận đăng ký doanh nghiệp',
          'Danh sách đội ngũ kĩ thuật và văn bằng',
          'Phương án kinh doanh',
          'Phương án bảo mật và an toàn thông tin mạng',
          'Phương án kỹ thuật và Phương án bảo hành bảo trì',
          'Tài liệu kĩ thuật',
          'Giấy chứng nhận hợp quy',
        ];
      case 'Sửa đổi, bổ sung Giấy phép kinh doanh':
        return [
          'Đơn đề nghị cấp sửa đổi, bổ sung Giấy phép kinh doanh',
          'Giấy phép kinh doanh sản phẩm, dịch vụ mật mã dân sự',
        ];
      case 'Gia hạn Giấy phép kinh doanh':
        return [
          'Đơn đề nghị gia hạn Giấy phép kinh doanh',
          'Giấy phép kinh doanh sản phẩm, dịch vụ mật mã dân sự',
          'Báo cáo hoạt động của doanh nghiệp',
        ];
      case 'Cấp lại Giấy phép kinh doanh':
        return ['Đơn đề nghị cấp lại Giấy phép kinh doanh'];
      case 'Cấp Giấy phép xuất khẩu, nhập khẩu':
        return [
          'Đơn đề nghị cấp Giấy phép xuất khẩu, nhập khẩu',
          'Giấy phép kinh doanh sản phẩm, dịch vụ mật mã dân sự',
          'Tài liệu kĩ thuật',
          'Giấy chứng nhận hợp quy',
        ];
      case 'Báo cáo hoạt động định kỳ':
        return ['Báo cáo hoạt động của doanh nghiệp'];
      default:
        throw new Error('Loại thủ tục không xác định');
    }
  }

  async create(data: any) {
    const requiredTaiLieuNames = this.getRequiredTaiLieu(data.loai_thu_tuc);

    // Generate Ma Ho So: HS-YYYYMMDD-HHMMSS
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const maHoSo = `HS-${timestamp}`;

    const t = await sequelize.transaction();

    try {
      const hoSo = await HoSo.create(
        { ...data, ma_ho_so: maHoSo, trang_thai_ho_so: 'MoiTao' },
        { transaction: t }
      );

      for (const ten of requiredTaiLieuNames) {
        const loaiTL = await LoaiTaiLieu.findOne({ where: { ten }, transaction: t });
        if (!loaiTL) throw new Error(`Không tìm thấy loại tài liệu '${ten}'`);

        await HoSoTaiLieu.create(
          {
            ho_so_id: hoSo.id,
            loai_tai_lieu_id: loaiTL.id,
          },
          { transaction: t }
        );
      }

      await t.commit();
      return hoSo;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async list(page: number, limit: number, doanhNghiepId: string, params: any) {
    const offset = (page - 1) * limit;
    const where: any = { doanh_nghiep_id: doanhNghiepId };

    if (params.ma_ho_so) where.ma_ho_so = { [Op.iLike]: `%${params.ma_ho_so}%` };
    if (params.loai_thu_tuc) where.loai_thu_tuc = params.loai_thu_tuc;
    if (params.trang_thai_ho_so) where.trang_thai_ho_so = params.trang_thai_ho_so;

    if (params.ngay_dang_ky_from || params.ngay_dang_ky_to) {
      where.ngay_dang_ky = {};
      if (params.ngay_dang_ky_from) where.ngay_dang_ky[Op.gte] = params.ngay_dang_ky_from;
      if (params.ngay_dang_ky_to) where.ngay_dang_ky[Op.lte] = params.ngay_dang_ky_to;
    }

    const { rows, count } = await HoSo.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [DoanhNghiep],
    });

    return { data: rows, total: count };
  }

  async getDetails(id: string) {
    return await HoSo.findByPk(id, {
      include: [
        DoanhNghiep,
        {
          model: HoSoTaiLieu,
          include: [LoaiTaiLieu, TaiLieu],
        },
      ],
    });
  }

  async update(id: string, data: any) {
    const hoSo = await HoSo.findByPk(id);
    if (!hoSo) throw new Error('Không tìm thấy hồ sơ');
    return await hoSo.update(data);
  }

  async delete(id: string) {
    const hoSo = await HoSo.findByPk(id);
    if (!hoSo) throw new Error('Không tìm thấy hồ sơ');
    if (hoSo.trang_thai_ho_so !== 'MoiTao' && hoSo.trang_thai_ho_so !== 'BiTraLai') {
      throw new Error('Hồ sơ đang xử lý hoặc đã duyệt, không thể xóa');
    }

    // Check GiayPhep exists (logic from Go) - database constraint usually handles this but we can check
    const gp = await GiayPhep.findOne({ where: { ho_so_id: id } });
    if (gp) throw new Error('Hồ sơ đã được cấp giấy phép, không thể xóa');

    // Delete files physically
    // Get all TaiLieu
    const hstls = await HoSoTaiLieu.findAll({ where: { ho_so_id: id }, include: [TaiLieu] });
    for (const hstl of hstls) {
      for (const tl of hstl.tai_lieus) {
        if (tl.duong_dan) {
          const physicalPath = path.join(__dirname, '../../', tl.duong_dan);
          if (fs.existsSync(physicalPath)) fs.unlinkSync(physicalPath);
        }
      }
    }
    const hoSoDir = path.join(__dirname, '../../uploads/ho_so', id);
    if (fs.existsSync(hoSoDir)) fs.rmSync(hoSoDir, { recursive: true, force: true });

    return await hoSo.destroy();
  }

  async uploadTaiLieu(hoSoTaiLieuId: string, tieuDe: string, file: Express.Multer.File) {
    const khe = await HoSoTaiLieu.findByPk(hoSoTaiLieuId);
    if (!khe) throw new Error('Khe tài liệu không tồn tại');

    const hoSoId = khe.ho_so_id;
    const uniqueName = path.basename(file.filename); // Multer should have handled renaming if configured, or we do it here

    // NOTE: Multer middleware in Controller handles the physical save to tmp or final?
    // In Go, it saved to tmp then renamed. Here we can assume Controller handled save to tmp.

    // We will assume Controller passes us the file object and we move it.
    const finalDir = path.join(__dirname, '../../uploads/ho_so', hoSoId);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

    const finalPath = path.join(finalDir, file.filename);

    // Move from tmp (file.path) to final
    fs.renameSync(file.path, finalPath);

    const relativePath = path
      .join('uploads', 'ho_so', hoSoId, file.filename)
      .replace(/\\/g, '/');


    return await TaiLieu.create({
      ho_so_tai_lieu_id: hoSoTaiLieuId,
      tieu_de: tieuDe || file.originalname,
      duong_dan: relativePath,
    });
  }

  async deleteTaiLieu(id: string) {
    const tl = await TaiLieu.findByPk(id);
    if (!tl) throw new Error('Không tìm thấy tài liệu');

    const physicalPath = path.join(__dirname, '../../', tl.duong_dan);
    if (fs.existsSync(physicalPath)) fs.unlinkSync(physicalPath);

    return await tl.destroy();
  }

  async getTaiLieuById(id: string) {
    return await TaiLieu.findByPk(id);
  }

  async getLoaiTaiLieu(tenThuTuc?: string) {
    if (tenThuTuc) {
      const names = this.getRequiredTaiLieu(tenThuTuc);
      return await LoaiTaiLieu.findAll({ where: { ten: names } });
    }

    // Grouped
    const allProcedures = [
      'Cấp mới Giấy phép kinh doanh',
      'Sửa đổi, bổ sung Giấy phép kinh doanh',
      'Gia hạn Giấy phép kinh doanh',
      'Cấp lại Giấy phép kinh doanh',
      'Cấp Giấy phép xuất khẩu, nhập khẩu',
      'Báo cáo hoạt động định kỳ',
    ];

    const result = [];
    for (const proc of allProcedures) {
      const names = this.getRequiredTaiLieu(proc);
      const docs = await LoaiTaiLieu.findAll({ where: { ten: names } });
      result.push({ ten_thu_tuc: proc, tai_lieus: docs });
    }
    return result;
  }
}
