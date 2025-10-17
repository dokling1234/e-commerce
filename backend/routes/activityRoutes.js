const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleWare");
const { logActivity } = require("../controllers/activityLogController");


router.get("/", authMiddleware, logActivity );

module.exports = router;