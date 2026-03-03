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

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function startServer() {
  await connectDB();
  configureCloudinary();

  const app = express();

  // security
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  // configure CORS - allow frontend origin or default to all
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
    })
  );

  // request logging
  app.use(
    morgan('combined', {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );

  app.use(express.json());

  // api routes
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/upload', uploadRoutes);
  app.get('/api/health', (_req, res) => res.json({ status: 'up' }));

  // error handling
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 WHIP4YOU API listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start backend:', err);
});
