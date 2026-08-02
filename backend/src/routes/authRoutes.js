import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getTalents
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  
router.get('/talents', protect, getTalents);

export default router;
