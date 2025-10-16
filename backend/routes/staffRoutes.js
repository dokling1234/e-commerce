const router = require("express").Router();
const { authMiddleware, requireSuperAdmin } = require("../middleware/authMiddleWare");
const logActivity = require("../middleware/activityLogger");
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus
} = require("../controllers/staffController");

// All routes require authentication AND superadmin role
router.post("/", authMiddleware, requireSuperAdmin, logActivity("Created new staff account"), createStaff);
router.get("/", authMiddleware, requireSuperAdmin, getAllStaff);
router.get("/:id", authMiddleware, requireSuperAdmin, getStaffById);
router.put("/:id", authMiddleware, requireSuperAdmin, logActivity("Updated staff account"), updateStaff);
router.delete("/:id", authMiddleware, requireSuperAdmin, logActivity("Deleted staff account"), deleteStaff);
router.put("/:id/status", authMiddleware, requireSuperAdmin, logActivity("Toggled staff status"), toggleStaffStatus);

module.exports = router;

