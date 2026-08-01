import Notification from '../models/Notification.js';

// Get current notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      if (notification.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }
      notification.isRead = true;
      const updated = await notification.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getNotifications, markNotificationRead };
