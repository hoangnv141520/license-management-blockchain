import { Request, Response } from 'express';
import { DoanhNghiepService } from '../services/DoanhNghiepService';
import * as path from 'path';
import * as fs from 'fs';

const service = new DoanhNghiepService();

export class DoanhNghiepController {
  async create(req: Request, res: Response) {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ data });
    } catch (error: any) {
      if (error.message === 'Mã số doanh nghiệp đã tồn tại') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Không tìm thấy doanh nghiệp' });
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByMaSo(req: Request, res: Response) {
    try {
      const data = await service.getByMaSo(req.params.maso);
      if (!data) return res.status(404).json({ error: 'Không tìm thấy doanh nghiệp' });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { ten_vi, ten_en, viet_tat, ma_so } = req.query;

      const result = await service.list(page, limit, ten_vi as string, ten_en as string, viet_tat as string, ma_so as string);
      
      res.json({
        ...result,
        page,
        limit,
        ten_vi, ten_en, viet_tat, ma_so
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await service.update(req.params.id, req.body);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async changeMSDN(req: Request, res: Response) {
    try {
      const data = await service.changeMSDN(req.params.id, req.body);
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async uploadGCN(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Vui lòng gửi file' });
      const data = await service.uploadGCN(req.params.id, req.file);
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async viewGCN(req: Request, res: Response) {
    try {
      const dbPath = await service.getGCNFilePath(req.params.id);
      const physicalPath = path.join(__dirname, '../../', dbPath);
      if (!fs.existsSync(physicalPath)) return res.status(404).json({ error: 'File không tồn tại' });
      res.sendFile(physicalPath);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
