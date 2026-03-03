
import express from 'express';
import { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} from '../controllers/VehicleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getVehicles).post(protect, admin, createVehicle);
router.route('/:id')
  .get(getVehicleById)
  .patch(protect, admin, updateVehicle)
  .delete(protect, admin, deleteVehicle);

export default router;
