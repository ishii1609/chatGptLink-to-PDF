import { Router } from 'express';
import { convertLimiter } from '../middleware/rateLimiter.js';
import { convertToPdf } from '../controllers/convert.controller.js';

const router = Router();

router.post('/convert', convertLimiter, convertToPdf);

export default router;