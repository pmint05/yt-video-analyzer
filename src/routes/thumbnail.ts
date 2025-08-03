import Router from 'express';
import { getThumbnail } from '../controllers/thumbnail/index';
const router = Router();

router.get('/:fileName', getThumbnail);

export default router;
