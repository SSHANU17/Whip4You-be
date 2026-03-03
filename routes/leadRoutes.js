
import express from 'express';
import { createLead, getLeads, updateLead } from '../controllers/LeadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createLead).get(protect, admin, getLeads);
router.route('/:id').patch(protect, admin, updateLead);

export default router;
