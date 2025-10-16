const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true }, // Optional, sparse index allows nulls
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String }, // Optional for backward compatibility
  role: { type: String, enum: ["superadmin", "staff"], default: "superadmin" }, // Default to superadmin for existing users
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

// Hash password before save
AdminUserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
AdminUserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("AdminUser", AdminUserSchema);
