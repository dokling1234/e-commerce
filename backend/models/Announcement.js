const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  label: { type: String, required: true }, 
  body: { type: String, required: true },
  media: [{ type: String }], 
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);
