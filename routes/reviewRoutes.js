
import express from 'express';
import { getReviews, getAdminReviews, updateReview } from '../controllers/ReviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getReviews);
router.route('/admin').get(protect, admin, getAdminReviews);
router.route('/:id').patch(protect, admin, updateReview);

export default router;
