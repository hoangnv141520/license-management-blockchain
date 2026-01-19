import { Router } from 'express';
import doanhNghiepRoutes from './doanhNghiepRoutes';
import hoSoRoutes from './hoSoRoutes';
import giayPhepRoutes from './giayPhepRoutes';
import authRoutes from './authRoutes';
import blockchainRoutes from './blockchainRoutes';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);

// Blockchain routes (public for testing, can add auth later)
router.use('/blockchain', blockchainRoutes);

// Protected routes
router.use('/doanh-nghiep', authenticateToken, doanhNghiepRoutes);
// HoSo routes are a bit mixed in Go code (/api/v1/ho-so, /api/v1/tai-lieu, /api/v1/loai-tai-lieu)
// In hoSoRoutes.ts I defined them with prefixes, so here I just mount to /
router.use('/', authenticateToken, hoSoRoutes);
router.use('/giay-phep', authenticateToken, giayPhepRoutes);

export default router;
