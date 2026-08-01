import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, sendMessage);

router.route('/:userId')
  .get(protect, getChatHistory);

export default router;
