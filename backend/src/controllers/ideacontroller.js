import Ideaform from "../models/Ideaform.js";

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

    if (idea.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "User not authorized",
      });
    }

    await idea.deleteOne();

    res.json({
      message: "Venture deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { createIdea, getIdeas, deleteIdea };