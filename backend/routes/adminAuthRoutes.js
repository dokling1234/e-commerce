// routes/adminAuthRoutes.js
const router = require("express").Router();
const { login } = require("../controllers/AdminAuthController");

router.post("/login", login);

module.exports = router;
