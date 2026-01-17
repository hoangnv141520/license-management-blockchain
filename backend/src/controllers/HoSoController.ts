import { Request, Response } from 'express';
import { HoSoService } from '../services/HoSoService';
import * as path from 'path';
import * as fs from 'fs';

const service = new HoSoService();

export class HoSoController {
  async create(req: Request, res: Response) {
    try {
      const data = await service.create(req.body);
      const details = await service.getDetails(data.id);
      res.status(201).json({ data: details });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async listLoaiTaiLieu(req: Request, res: Response) {
    try {
      const data = await service.getLoaiTaiLieu(req.query.ten_thu_tuc as string);
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDetails(req: Request, res: Response) {
    try {
      const data = await service.getDetails(req.params.id);
      if (!data) return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const doanhNghiepId = req.query.doanh_nghiep_id as string;
      
      if (!doanhNghiepId) return res.status(400).json({ error: 'doanh_nghiep_id is required' });

      const result = await service.list(page, limit, doanhNghiepId, req.query);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async uploadTaiLieu(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Missing file' });
      const { ho_so_tai_lieu_id, tieu_de } = req.body;
      
      const data = await service.uploadTaiLieu(ho_so_tai_lieu_id, tieu_de, req.file);
      res.status(201).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTaiLieu(req: Request, res: Response) {
    try {
      await service.deleteTaiLieu(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async downloadTaiLieu(req: Request, res: Response) {
    try {
      const tl = await service.getTaiLieuById(req.params.id);
      if (!tl) return res.status(404).json({ error: 'Tài liệu không tồn tại' });
      
      const physicalPath = path.join(__dirname, '../../', tl.duong_dan);
      if (!fs.existsSync(physicalPath)) return res.status(404).json({ error: 'File vật lý không tồn tại' });
      
      res.sendFile(physicalPath);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      await service.update(req.params.id, req.body);
      const details = await service.getDetails(req.params.id);
      res.json({ data: details });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      res.status(200).json({ message: 'Đã xóa hồ sơ thành công' });
    } catch (error: any) {
       if (error.message.includes('không thể xóa')) {
           res.status(409).json({ error: error.message });
       } else {
           res.status(500).json({ error: error.message });
       }
    }
  }
}
