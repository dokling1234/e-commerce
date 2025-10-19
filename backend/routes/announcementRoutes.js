const router = require("express").Router();
const {logActivity} = require("../middleware/activityLogger");
const { authMiddleware } = require("../middleware/authMiddleWare");
const {deleteAnnouncement, addAnnouncement, toggleAnnouncementStatus, getAllAnnouncements  } = require("../controllers/announcementController");
const upload = require("../middleware/upload.js");

// Public route for getting announcements (no authentication required)
router.get("/public", getAllAnnouncements);
// Admin routes (authentication required)
router.get("/",authMiddleware, getAllAnnouncements);
router.post("/add", authMiddleware, upload.single("media"), logActivity("Added New Announcement"), addAnnouncement); 
router.post("/:id",authMiddleware, logActivity("Deleted Announcement"), deleteAnnouncement);
router.post("/:id/status",authMiddleware, logActivity("Disable/Enable Announcement"), toggleAnnouncementStatus );

module.exports = router;
