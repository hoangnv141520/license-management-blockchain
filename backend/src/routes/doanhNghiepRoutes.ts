import { Router } from 'express';
import { DoanhNghiepController } from '../controllers/DoanhNghiepController';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new DoanhNghiepController();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.get('/maso/:maso', controller.getByMaSo);
router.put('/:id', controller.update);
router.put('/:id/changemsdn', controller.changeMSDN);
router.delete('/:id', controller.delete);
router.post('/:id/uploadgcn', upload.single('file'), controller.uploadGCN);
router.get('/:id/viewgcn', controller.viewGCN);

export default router;
