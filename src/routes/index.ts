import { Router } from 'express';
import analyzeRouter from './analyze';
import apiRouter from './api';
import resultRouter from './result';
import thumbnailRouter from './thumbnail';


const router = Router();

router.use('/analyze', analyzeRouter);
router.use('/uploads/thumbnail', thumbnailRouter);
router.use('/result', resultRouter);
router.use('/api', apiRouter);

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


router.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
});


export default router;