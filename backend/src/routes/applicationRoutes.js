import express from 'express';
import {
  createApplication,
  getApplications,
  getReceivedPitches,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createApplication)
  .get(protect, getApplications);

router.route('/received')
  .get(protect, getReceivedPitches);

router.route('/:id')
  .put(protect, updateApplicationStatus)
  .delete(protect, deleteApplication);

export default router;
