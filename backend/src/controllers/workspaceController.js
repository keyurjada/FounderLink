import mongoose from 'mongoose';
import Workspace from '../models/Workspace.js';
import Task from '../models/Task.js';
import Ideaform from '../models/Ideaform.js';
import Application from '../models/Application.js';
import Message from '../models/Message.js';

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
    let workspaceFilter = {};

    if (req.user.role === 'Founder') {
      const founderStartups = await Ideaform.find({ userId: req.user._id }).select('_id');
      workspaceFilter = { startupId: { $in: founderStartups.map((item) => item._id) } };
    } else {
      const acceptedMatches = await Application.find({
        applicantId: req.user._id,
        status: 'Accepted'
      }).select('startupId');
      const acceptedStartupIds = acceptedMatches.map((item) => item.startupId);
      workspaceFilter = { startupId: { $in: acceptedStartupIds } };
    }

    const workspaces = await Workspace.find(workspaceFilter)
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
    const workspace = await Workspace.findById(wsId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const isFounder = req.user.role === 'Founder';
    const isAcceptedCoder = isFounder ? false : await Application.exists({
      startupId: workspace.startupId,
      applicantId: req.user._id,
      status: 'Accepted'
    });

    const isOwner = isFounder && workspace.startupId && await Ideaform.exists({
      _id: workspace.startupId,
      userId: req.user._id
    });

    if (!isOwner && !isAcceptedCoder) {
      return res.status(403).json({ message: 'You do not have access to this workspace' });
    }

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
      if (status) {
        task.status = status;
        if (status === 'completed') {
          task.completedAt = Date.now();
        } else {
          task.completedAt = null;
        }
      }
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

// Update workspace resources
const updateWorkspaceResources = async (req, res) => {
  const { githubLink, figmaLink, docsLink, targetLaunchDate } = req.body;
  try {
    const wsId = await resolveWorkspaceId(req.params.id);
    const workspace = await Workspace.findById(wsId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    // Assuming only Founder can update resources, but letting any member for simplicity
    if (githubLink !== undefined) workspace.githubLink = githubLink;
    if (figmaLink !== undefined) workspace.figmaLink = figmaLink;
    if (docsLink !== undefined) workspace.docsLink = docsLink;
    if (targetLaunchDate !== undefined) workspace.targetLaunchDate = targetLaunchDate;

    await workspace.save();
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history for workspace
const getWorkspaceChat = async (req, res) => {
  try {
    const wsId = await resolveWorkspaceId(req.params.id);
    const messages = await Message.find({ workspaceId: wsId })
      .populate('senderId', 'name firstname lastname role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a chat message in workspace
const sendWorkspaceMessage = async (req, res) => {
  const { content } = req.body; 
  try {
    const wsId = await resolveWorkspaceId(req.params.id);

    const message = await Message.create({
      workspaceId: wsId,
      senderId: req.user._id,
      content
    });

    // Populate sender details before returning
    await message.populate('senderId', 'name firstname lastname role');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  getWorkspaces, 
  createWorkspace, 
  getWorkspaceTasks, 
  addTask, 
  updateTask, 
  deleteTask,
  updateWorkspaceResources,
  getWorkspaceChat,
  sendWorkspaceMessage
};
