
import express from 'express';
import { authUser, registerUser } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/setup', registerUser);

export default router;
