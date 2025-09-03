const router = require("express").Router();
const { registerAdmin, login } = require("../controllers/AdminAuthController");

router.post("/register", registerAdmin);

router.post("/login", login);

module.exports = router;
