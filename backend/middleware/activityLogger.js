// middleware/activityLogger.js
const ActivityLog = require("../models/ActivityLog");

const logActivity = (action) => {
  return async (req, res, next) => {
    if (req.admin) {
      await ActivityLog.create({
        adminId: req.admin._id,
        action,
        details: { body: req.body, params: req.params }
      });
    }
    next();
  };
};

module.exports = logActivity;
