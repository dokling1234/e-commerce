// controllers/adminAuthController.js
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await AdminUser.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
};

module.exports = { login };
