import 'dotenv/config';

// Saari environment settings ek jagah, defaults ke saath
export const env = {
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 5,
};