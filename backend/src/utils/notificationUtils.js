import Notification from '../models/Notification.js';

/**
 * Utility to create a notification
 * @param {String} userId - ID of the user receiving the notification
 * @param {String} title - Notification title
 * @param {String} message - Notification message body
 * @param {String} type - Type of notification (info, success, warning)
 */
export const createNotification = async (userId, title, message, type = 'info') => {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type
    });
  } catch (error) {
    console.error("Failed to create notification for user:", userId, error);
  }
};
