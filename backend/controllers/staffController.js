const AdminUser = require("../models/AdminUser");

// Create new staff account
const createStaff = async (req, res) => {
  try {
    const { username, email, password, fullName, status } = req.body;

    // Validation - only required for NEW staff creation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }
    
    if (!username) {
      return res.status(400).json({ 
        success: false,
        message: "Username is required" 
      });
    }
    
    if (!fullName) {
      return res.status(400).json({ 
        success: false,
        message: "Full name is required" 
      });
    }

    // Check if username already exists
    const existingUsername = await AdminUser.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ 
        success: false,
        message: "Username already exists" 
      });
    }

    // Check if email already exists
    const existingEmail = await AdminUser.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    // Create new staff user
    const newStaff = new AdminUser({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      fullName,
      role: "staff", // Always staff
      status: status || "active"
    });

    await newStaff.save();

    // Return staff without password
    const staffData = newStaff.toObject();
    delete staffData.password;

    res.status(201).json({ 
      success: true,
      message: "Staff account created successfully",
      staff: staffData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// Get all staff accounts
const getAllStaff = async (req, res) => {
  try {
    const staff = await AdminUser.find({ role: "staff" })
      .select("-password")
      .sort({ createdAt: -1 }); // Newest first

    res.json({ 
      success: true,
      message: "All staff accounts retrieved",
      staff 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// Get single staff account
const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await AdminUser.findOne({ _id: id, role: "staff" })
      .select("-password");

    if (!staff) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    res.json({ 
      success: true,
      staff 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// Update staff account
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, fullName, status } = req.body;

    const staff = await AdminUser.findOne({ _id: id, role: "staff" });
    
    if (!staff) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    // Check if username is being changed and if it already exists
    if (username && username !== staff.username) {
      const existingUsername = await AdminUser.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ 
          success: false,
          message: "Username already exists" 
        });
      }
      staff.username = username;
    }

    // Check if email is being changed and if it already exists
    if (email && email !== staff.email) {
      const existingEmail = await AdminUser.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ 
          success: false,
          message: "Email already exists" 
        });
      }
      staff.email = email;
    }

    // Update other fields
    if (fullName) staff.fullName = fullName;
    if (status) staff.status = status;
    if (password) staff.password = password; // Will be hashed by pre-save middleware

    await staff.save();

    // Return updated staff without password
    const staffData = staff.toObject();
    delete staffData.password;

    res.json({ 
      success: true,
      message: "Staff account updated successfully",
      staff: staffData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// Delete staff account
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await AdminUser.findOne({ _id: id, role: "staff" });
    
    if (!staff) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    await AdminUser.findByIdAndDelete(id);

    res.json({ 
      success: true,
      message: "Staff account deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

// Toggle staff status (active/inactive)
const toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status. Must be 'active' or 'inactive'" 
      });
    }

    const staff = await AdminUser.findOne({ _id: id, role: "staff" });
    
    if (!staff) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    staff.status = status;
    await staff.save();

    // Return updated staff without password
    const staffData = staff.toObject();
    delete staffData.password;

    res.json({ 
      success: true,
      message: `Staff ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      staff: staffData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus
};

