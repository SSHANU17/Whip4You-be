
import express from 'express';
import { getConfig, updateConfig } from '../controllers/ConfigController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getConfig).patch(protect, admin, updateConfig);

export default router;
