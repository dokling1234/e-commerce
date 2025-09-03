const ActivityLog = require("../models/ActivityLog");

const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const now = new Date();
      const formattedDate = `${String(now.getMonth() + 1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`;
      const formattedTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

      const logData = {
        action,
        details: { body: req.body, params: req.params },
        adminId: req.admin._id,
        adminName: req.admin.username,
        formattedDate,
        formattedTime
      };

      await ActivityLog.create(logData);
    } catch (err) {
      console.error("Activity logging error:", err.message);
      // don't block the main request
    }

    next();
  };
};

module.exports = logActivity;
