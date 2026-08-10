// import Ideaform from "../models/Ideaform.js";

// const createIdea = async (req, res) => {
//   const {
//     startuptitle,
//     category,
//     equity,
//     description,
//     teamsize,
//     skillsRequired,
//   } = req.body;

//   try {
//     const idea = await Ideaform.create({
//       userId: req.user._id,
//       startuptitle,
//       category,
//       equity,
//       description,
//       teamsize,
//       skillsRequired,
//     });

//     res.status(201).json({
//       message: "StartUp Idea Uploaded Successfully",
//       idea,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const getIdeas = async (req, res) => {
//   try {
//     const ideas = await Ideaform.find()
//       .populate(
//         "userId",
//         "name firstname lastname email role title"
//       )
//       .sort({ createdAt: -1 });

//     res.json(ideas);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const deleteIdea = async (req, res) => {
//   try {
//     const idea = await Ideaform.findById(req.params.id);

//     if (!idea) {
//       return res.status(404).json({
//         message: "Venture not found",
//       });
//     }

//     if (idea.userId.toString() !== req.user._id.toString()) {
//       return res.status(401).json({
//         message: "User not authorized",
//       });
//     }

//     await idea.deleteOne();

//     res.json({
//       message: "Venture deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export { createIdea, getIdeas, deleteIdea };



import Ideaform from "../models/Ideaform.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { createNotification } from "../utils/notificationUtils.js";

const createIdea = async (req, res) => {
  const {
    startuptitle,
    category,
    equity,
    description,
    teamsize,
    skillsRequired,
  } = req.body;

  try {
    const idea = await Ideaform.create({
      userId: req.user._id,
      startuptitle,
      category,
      equity,
      description,
      teamsize,
      skillsRequired,
    });

    res.status(201).json({
      message: "StartUp Idea Uploaded Successfully",
      idea,
    });

    // Notify Founder
    await createNotification(
      req.user._id,
      "Project Created",
      `Your project "${startuptitle}" was created successfully. You can now receive applications!`,
      "success"
    );

    // Broadcast to all Coders (Talents)
    try {
      const allTalents = await User.find({ role: 'Talent' }).select('_id');
      const notifications = allTalents.map(t => ({
        userId: t._id,
        title: "New Startup Alert",
        message: `A new project "${startuptitle}" is looking for developers. Check it out!`,
        type: "info"
      }));
      if (notifications.length > 0) {
        // use mongoose insertMany directly or loop createNotification
        const Notification = (await import('../models/Notification.js')).default;
        await Notification.insertMany(notifications);
      }
    } catch (err) {
      console.error("Failed to broadcast startup creation", err);
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getIdeas = async (req, res) => {
  try {
    const ideas = await Ideaform.find()
      .populate(
        "userId",
        "name firstname lastname email role title"
      )
      .sort({ createdAt: -1 });

    res.json(ideas);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const idea = await Ideaform.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Venture not found",
      });
    }

    // Check ownership
    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "User not authorized",
      });
    }

    // Find applications to notify coders before deleting
    const appsToDelete = await Application.find({ startupId: idea._id }).populate('applicantId');
    
    // Delete all applications for this startup
    await Application.deleteMany({
      startupId: idea._id,
    });

    // Delete the startup
    const ideaTitle = idea.startuptitle;
    await idea.deleteOne();

    res.json({
      message: "Venture and related applications deleted successfully",
    });

    // Notify affected coders
    try {
      for (const app of appsToDelete) {
        if (app.applicantId) {
          await createNotification(
            app.applicantId._id,
            "Project Closed",
            `The project "${ideaTitle}" has been closed by its founder.`,
            "warning"
          );
        }
      }
    } catch (err) {
      console.error("Failed to notify coders of project deletion", err);
    }

  } catch (error) {
    console.error("Delete venture error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createIdea,
  getIdeas,
  deleteIdea
};