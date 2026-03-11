
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// backend imports
import connectDB from './config/db.js';
import configureCloudinary from './config/cloudinary.js';
import logger from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import leadRoutes from './routes/leadRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import configRoutes from './routes/configRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

async function startServer() {
  await connectDB();
  configureCloudinary();

  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: [
        'https://www.whip4you.ca',
        'https://whip4-you-nv3j.vercel.app',
        process.env.CORS_ORIGIN || 'http://localhost:3000',
      ],
      credentials: true,
    })
  );

  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );

  app.use(express.json());

  // Root route
  app.get('/', (_req, res) => res.json({ message: 'WHIP4YOU API - Premium Used Car Dealership Backend', version: '1.0.0' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/upload', uploadRoutes);

  app.get('/api/health', (_req, res) => res.json({ status: 'up' }));

  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 WHIP4YOU API listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start backend:', err);
});
