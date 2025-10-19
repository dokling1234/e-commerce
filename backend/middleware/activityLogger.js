const ActivityLog = require("../models/ActivityLog");

const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const now = new Date();
      const formattedDate = `${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
      const formattedTime = `${String(now.getHours()).padStart(
        2,
        "0"
      )}:${String(now.getMinutes()).padStart(2, "0")}`;

      const logData = {
        action,
        details: { body: req.body, params: req.params },
        adminId: req.admin._id,
        adminName: admin?.username || details?.buyerName || "Client",
        formattedDate,
        formattedTime,
      };

      await ActivityLog.create(logData);
    } catch (err) {
      console.error("Activity logging error:", err.message);
    }

    next();
  };
};
const logOrderActivity = async ({ action, admin, details }) => {
  try {
    const now = new Date();
    await ActivityLog.create({
      action,
      adminId: admin?._id || null,
      adminName: admin?.username || details?.buyerName || "Client",
      details,
      formattedDate: `${String(now.getMonth() + 1).padStart(2, "0")}/${String(
        now.getDate()
      ).padStart(2, "0")}/${now.getFullYear()}`,
      formattedTime: `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`,
    });
  } catch (err) {
    console.error("Activity logging error:", err.message);
  }
};

module.exports = { logActivity, logOrderActivity };
