const router = require("express").Router();
const logActivity = require("../middleware/activityLogger");
const authMiddleware = require("../middleware/authMiddleware");
const {deleteAnnouncement, addAnnouncement, toggleAnnouncementStatus, getAllAnnouncements  } = require("../controllers/announcementController");

router.get("/",authMiddleware, getAllAnnouncements);
router.post("/add",authMiddleware, logActivity("Added New Announcement"), addAnnouncement);
router.post("/:id",authMiddleware, logActivity("Deleted Announcement"), deleteAnnouncement);
router.post("/:id/status",authMiddleware, logActivity("Disable/Enable Announcement"), toggleAnnouncementStatus );

module.exports = router;
