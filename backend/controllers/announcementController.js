const Announcement = require("../models/Announcement");

const addAnnouncement = async (req, res) => {
  try {
    const { title, label, body } = req.body;

    if (!title || !label || !body) {
      return res
        .status(400)
        .json({ message: "Title, label, and body are required" });
    }
    const media = req.file ? req.file.path : null;

    const newAnnouncement = new Announcement({
      title,
      label,
      body,
      media,
    });

    await newAnnouncement.save();

    res
      .status(201)
      .json({
        message: "Announcement created successfully",
        announcement: newAnnouncement,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    await Announcement.findByIdAndDelete(id);

    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const toggleAnnouncementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.active = active;
    await announcement.save();

    res.json({
      message: `Announcement ${active ? "enabled" : "archived"}`,
      announcement,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//get all
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); 
    res.json({ message: "All announcements", announcements });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  getAllAnnouncements,
};
