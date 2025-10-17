
const Notification = require("../models/Notification");

const notifications = async (req, res) => {

  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50); // limit to last 50
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
module.exports = notifications;