import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Ek IP se 1 minute mein max N requests (PDF banana mehnga kaam hai)
export const convertLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Bahut zyada requests. Thodi der baad try karo.' },
});