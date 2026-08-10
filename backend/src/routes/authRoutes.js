import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getTalents,
  uploadUserResume
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import uploadResume from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  
router.put('/resume', protect, uploadResume.single('resume'), uploadUserResume);
  
router.get('/talents', protect, getTalents);

export default router;
