import Message from '../models/Message.js';

// Get chat history with another user
const getChatHistory = async (req, res) => {
  const otherUser = req.params.userId;
  const current = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: current, receiverId: otherUser },
        { senderId: otherUser, receiverId: current }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a new direct chat message
const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getChatHistory, sendMessage };
