const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

// Register
const registerAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existing = await AdminUser.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newAdmin = new AdminUser({ username, password, role });
    await newAdmin.save();

    res.status(201).json({ message: "Admin user created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AdminUser.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//getAll
const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.find().select("-password"); // exclude password
    res.json({ message: "All admin accounts", admins });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerAdmin, login, getAllAdmins  };
