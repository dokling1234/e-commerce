const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  label: { type: String, required: true }, // e.g., "info", "alert", "event"
  body: { type: String, required: true },
  media: [{ type: String }], // array of image URLs (optional)
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);
