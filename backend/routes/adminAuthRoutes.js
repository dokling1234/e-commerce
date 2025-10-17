const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleWare");
const { registerAdmin, login, getAllAdmins, getAdminInfo, updateAdminInfo } = require("../controllers/adminAuthController");

router.post("/register", registerAdmin);

router.post("/login", login);

router.get("/",authMiddleware, getAllAdmins);

router.get("/me", authMiddleware, getAdminInfo);

router.put("/update", authMiddleware, updateAdminInfo);


module.exports = router;
