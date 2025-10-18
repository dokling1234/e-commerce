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
  try {
    const { email, password } = req.body; // Accept email instead of username
    const user = await AdminUser.findOne({ email }); // Find by email

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user account is active (only for staff accounts)
    if (user.role === "staff" && user.status === "inactive") {
      return res.status(403).json({ 
        message: "Your account has been deactivated. Please contact the administrator." 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { 
        id: user._id, 
        username: user.username || user.email.split('@')[0], // Fallback to email prefix
        email: user.email, 
        fullName: user.fullName || user.email, // Fallback to email
        role: user.role || "superadmin", // Fallback to superadmin for existing users
        status: user.status || "active" // Fallback to active
      },
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

const getAdminInfo = async (req, res) => {
  try {
    const adminId = req.admin.id; 
    const admin = await AdminUser.findById(adminId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update admin info
const updateAdminInfo = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { fullName, email, phone, role, bio, language, timezone, notifications } = req.body;

    const admin = await AdminUser.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Update fields
    admin.fullName = fullName || admin.fullName;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;
    admin.role = role || admin.role;
    admin.bio = bio || admin.bio;
    admin.language = language || admin.language;
    admin.timezone = timezone || admin.timezone;
    admin.notifications = notifications || admin.notifications;

    await admin.save();
    res.json({ message: "Admin updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { registerAdmin, login, getAllAdmins, getAdminInfo, updateAdminInfo  };
