const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  adminName: { type: String }, 
  action: { type: String, required: true },
  details: { type: Object },
  formattedDate: { type: String }, // MM/DD/YYYY
  formattedTime: { type: String }, // 24hr 
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
