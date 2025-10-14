const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

// Register
const registerAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newAdmin = new AdminUser({ email, password, role });
    await newAdmin.save();

    res.status(201).json({ message: "Admin user created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
const login = async (req, res) => {
  console.log("check")
  try {
    const { email, password } = req.body; // Accept email instead of username
    const user = await AdminUser.findOne({ email }); // Find by email

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
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
