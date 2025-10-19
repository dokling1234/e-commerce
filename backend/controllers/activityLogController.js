const ActivityLogModel = require("../models/ActivityLog");

const logActivity = async (req, res) => {
  try {
    const logs = await ActivityLogModel.find().sort({ createdAt: -1 });
    console.log(logs)
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};  
module.exports = {
  logActivity,
};
