import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import convertRoutes from './routes/convert.route.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '10kb' })); // chhoti body hi chahiye

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', convertRoutes);
// Production mein built React frontend yahin se serve hoga
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});
// errorHandler hamesha sabse last mein
app.use(errorHandler);

export default app;