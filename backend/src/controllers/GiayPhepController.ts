import { Request, Response } from 'express';
import { GiayPhepService } from '../services/GiayPhepService';
import { FabricClient, getFabricConfig } from '../config/fabric';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Fabric Client once
const fabricConfig = getFabricConfig();
const fabricClient = new FabricClient(fabricConfig);
// Connect in background
fabricClient.connect();

const service = new GiayPhepService(fabricClient);

export class GiayPhepController {
  async create(req: Request, res: Response) {
    try {
      const data = await service.create(req.body);
      res.status(201).json({ data });
    } catch (error: any) {
      if (error.message === 'Hồ sơ đã được cấp giấy phép' || error.message.includes('đã tồn tại')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      await service.update(req.params.id, req.body);
      const details = await service.getById(req.params.id);
      res.json({ data: details });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await service.getById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Không tìm thấy giấy phép' });
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const doanhNghiepId = req.query.doanh_nghiep_id as string;

      const result = await service.list(page, limit, doanhNghiepId, req.query);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('hiệu lực')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Missing file' });
      const data = await service.uploadFile(req.params.id, req.file);
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async downloadFile(req: Request, res: Response) {
    try {
      const gp = await service.getById(req.params.id);
      if (!gp || !gp.file_duong_dan) return res.status(404).json({ error: 'Chưa có file' });

      const physicalPath = path.join(__dirname, '../../', gp.file_duong_dan);
      if (!fs.existsSync(physicalPath)) return res.status(404).json({ error: 'File vật lý không tồn tại' });

      res.sendFile(physicalPath);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async pushToBlockchain(req: Request, res: Response) {
    try {
      await service.pushToBlockchain(req.params.id);
      res.json({ message: 'Đã đẩy h1 và h2 lên blockchain thành công' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const result = await service.verify(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
