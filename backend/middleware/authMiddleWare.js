const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await AdminUser.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to require superadmin role
const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized" 
    });
  }
  
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Superadmin only." 
    });
  }
  
  next();
};

module.exports = { authMiddleware, requireSuperAdmin };
