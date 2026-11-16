import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import convertRoutes from './routes/convert.route.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '10kb' })); // chhoti body hi chahiye

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', convertRoutes);

// errorHandler hamesha sabse last mein
app.use(errorHandler);

export default app;