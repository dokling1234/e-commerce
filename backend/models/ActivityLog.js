const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
  action: String,
  details: Object
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
