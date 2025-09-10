const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleWare");
const { registerAdmin, login, getAllAdmins } = require("../controllers/AdminAuthController");

router.post("/register", registerAdmin);

router.post("/login", login);

router.get("/",authMiddleware, getAllAdmins);

module.exports = router;
