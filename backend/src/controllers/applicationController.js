import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Ideaform from '../models/Ideaform.js';
import Notification from '../models/Notification.js';

// Create a new application/pitch
const createApplication = async (req, res) => {
  const { startupId, pitchText } = req.body;

  try {
    if (!startupId || !pitchText || !pitchText.trim()) {
      return res.status(400).json({ message: 'Startup and pitch text are required' });
    }

    const existing = await Application.findOne({
      startupId,
      applicantId: req.user._id
    });

    if (existing) {
      return res.status(409).json({ message: 'You already applied to this startup' });
    }

    const application = await Application.create({
      startupId,
      applicantId: req.user._id,
      pitchText: pitchText.trim(),
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

// Fetch pitches received by a founder only for their own startups
const getReceivedPitches = async (req, res) => {
  try {
    const founderStartups = await Ideaform.find({ userId: req.user._id }).select('_id');
    const startupIds = founderStartups.map((item) => item._id);

    const applications = await Application.find({
      startupId: { $in: startupIds }
    })
      .populate('startupId')
      .populate('applicantId', 'name firstname lastname email');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status / Accept / Reject
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id).populate('startupId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const startup = application.startupId;
    if (!startup || startup.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update applications for your own startup' });
    }

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


// Acceped application 
// Fetch projects accepted by founders for the logged-in coder
const getAcceptedApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user._id,
      status: 'Accepted'
    })
      .populate('startupId')
      .populate('applicantId', 'name firstname lastname email');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createApplication, getApplications, getAcceptedApplications, getReceivedPitches, updateApplicationStatus, deleteApplication };
