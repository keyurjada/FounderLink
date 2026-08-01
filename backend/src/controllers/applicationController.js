import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

// Create a new application/pitch
const createApplication = async (req, res) => {
  const { startupId, pitchText } = req.body;

  try {
    const application = await Application.create({
      startupId,
      applicantId: req.user._id,
      pitchText,
      status: 'Pending'
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch user's applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate('startupId')
      .populate('applicantId', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch pitches received by a founder
const getReceivedPitches = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('startupId')
      .populate('applicantId', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status / Accept / Reject
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      application.status = status;
      await application.save();

      if (status === 'Accepted') {
        const Workspace = mongoose.model('Workspace');
        const exists = await Workspace.findOne({ matchId: application._id });
        if (!exists) {
          await Workspace.create({
            matchId: application._id,
            startupId: application.startupId
          });
        }
      }

      res.json(application);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete/withdraw application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      if (application.applicantId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }
      await application.deleteOne();
      res.json({ message: 'Application withdrawn successfully' });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createApplication, getApplications, getReceivedPitches, updateApplicationStatus, deleteApplication };
