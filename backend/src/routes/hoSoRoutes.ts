import { Router } from 'express';
import { HoSoController } from '../controllers/HoSoController';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new HoSoController();

router.get('/loai-tai-lieu', controller.listLoaiTaiLieu);

router.post('/ho-so', controller.create);
router.get('/ho-so', controller.list);
router.get('/ho-so/:id', controller.getDetails);
router.put('/ho-so/:id', controller.update);
router.delete('/ho-so/:id', controller.delete);

router.post('/tai-lieu/upload', upload.single('file'), controller.uploadTaiLieu);
router.delete('/tai-lieu/:id', controller.deleteTaiLieu);
router.get('/tai-lieu/download/:id', controller.downloadTaiLieu);

export default router;
