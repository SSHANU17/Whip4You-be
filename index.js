
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
import dbCheckMiddleware from './middleware/dbCheckMiddleware.js';
import Vehicle from './models/Vehicle.js';

dotenv.config();

async function startServer() {
  connectDB().catch(err => console.error("Asynchronous DB connection failed:", err));
  configureCloudinary();

  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(cors({ origin: '*' }));

  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );

  app.use(express.json());

  // Root route
  app.get('/', (_req, res) => res.json({ message: 'WHIP4YOU API - Premium Used Car Dealership Backend', version: '1.0.0' }));

  const handleSitemap = async (_req, res) => {
    try {
      const site = (process.env.PUBLIC_SITE_URL || 'https://www.whip4you.com').replace(/\/$/, '');
      const vehicles = await Vehicle.find({ status: 'Available', isHidden: { $ne: true } }).select('_id year make model images imageAlts updatedAt');
      const escapeXml = value => String(value ?? '').replace(/[<>&'"]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]);
      const staticRoutes = ['', '/inventory', '/finance', '/calculator', '/about', '/contact', '/trade-in', '/car-finder'];
      const urls = staticRoutes.map(path => `<url><loc>${site}${path}</loc></url>`);
      for (const vehicle of vehicles) {
        const loc = `${site}/vehicle/${vehicle._id}`;
        const image = vehicle.images?.[0];
        const imageTag = image ? `<image:image><image:loc>${escapeXml(image)}</image:loc><image:title>${escapeXml(vehicle.imageAlts?.[0] || `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale in Surrey, BC`)}</image:title></image:image>` : '';
        const lastmod = vehicle.updatedAt ? `<lastmod>${new Date(vehicle.updatedAt).toISOString()}</lastmod>` : '';
        urls.push(`<url><loc>${loc}</loc>${lastmod}${imageTag}</url>`);
      }
      res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`);
    } catch (error) {
      logger.error(`Sitemap generation failed: ${error.message}`);
      res.status(503).type('text/plain').send('Sitemap temporarily unavailable');
    }
  };

  app.get('/sitemap.xml', handleSitemap);
  app.get('/api/sitemap.xml', handleSitemap);

  app.use('/api', dbCheckMiddleware);

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
