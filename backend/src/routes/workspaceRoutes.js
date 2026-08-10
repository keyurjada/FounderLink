import express from 'express';
import {
  getWorkspaces,
  createWorkspace,
  getWorkspaceTasks,
  addTask,
  updateTask,
  deleteTask,
  updateWorkspaceResources,
  getWorkspaceChat,
  sendWorkspaceMessage
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getWorkspaces)
  .post(protect, createWorkspace);

router.route('/:id/tasks')
  .get(protect, getWorkspaceTasks)
  .post(protect, addTask);

router.route('/:id/tasks/:taskId')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/resources')
  .put(protect, updateWorkspaceResources);

router.route('/:id/chat')
  .get(protect, getWorkspaceChat)
  .post(protect, sendWorkspaceMessage);

export default router;
