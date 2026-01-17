import { Router } from 'express';
import { GiayPhepController } from '../controllers/GiayPhepController';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new GiayPhepController();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.post('/:id/upload', upload.single('file'), controller.uploadFile);
router.get('/:id/view-file', controller.downloadFile);
router.post('/:id/push-blockchain', controller.pushToBlockchain);
router.get('/:id/verify', controller.verify);

export default router;
