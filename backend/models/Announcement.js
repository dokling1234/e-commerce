const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  message: String,
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);
