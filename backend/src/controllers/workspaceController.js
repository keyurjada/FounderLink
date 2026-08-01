import mongoose from 'mongoose';
import Workspace from '../models/Workspace.js';
import Task from '../models/Task.js';

// Resolve 'default' workspace ID
const resolveWorkspaceId = async (id) => {
  if (id === 'default') {
    let ws = await Workspace.findOne();
    if (!ws) {
      ws = await Workspace.create({
        matchId: new mongoose.Types.ObjectId(),
        startupId: new mongoose.Types.ObjectId()
      });
    }
    return ws._id;
  }
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    let ws = await Workspace.findById(id);
    if (ws) return ws._id;
    
    ws = await Workspace.findOne({ startupId: id });
    if (!ws) {
      ws = await Workspace.create({
        startupId: id,
        matchId: new mongoose.Types.ObjectId()
      });
    }
    return ws._id;
  }
  
  return id;
};

// Get workspaces user is part of
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find()
      .populate('startupId')
      .populate('matchId');
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new workspace (normally done on match acceptance)
const createWorkspace = async (req, res) => {
  const { matchId, startupId } = req.body;

  try {
    const workspace = await Workspace.create({
      matchId,
      startupId
    });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks for a workspace
const getWorkspaceTasks = async (req, res) => {
  try {
    const wsId = await resolveWorkspaceId(req.params.id);
    const tasks = await Task.find({ workspaceId: wsId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add task to a workspace
const addTask = async (req, res) => {
  const { title, assignee, dueDate } = req.body;

  try {
    const wsId = await resolveWorkspaceId(req.params.id);
    const task = await Task.create({
      workspaceId: wsId,
      title,
      assignee,
      status: 'todo',
      dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status / move lane
const updateTask = async (req, res) => {
  const { status, title, assignee } = req.body;

  try {
    const task = await Task.findById(req.params.taskId);

    if (task) {
      if (status) task.status = status;
      if (title) task.title = title;
      if (assignee) task.assignee = assignee;

      const updated = await task.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task ticket
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getWorkspaces, createWorkspace, getWorkspaceTasks, addTask, updateTask, deleteTask };
