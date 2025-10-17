const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminUserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    phone: { type: String }, // New
    bio: { type: String }, // New
    language: { type: String, default: "English" }, // New
    timezone: { type: String, default: "UTC+0" }, // New
    notifications: {
      type: String,
      enum: ["all", "important", "none"],
      default: "all",
    }, // New
    role: {
      type: String,
      enum: ["superadmin", "staff"],
      default: "superadmin",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Hash password before save
AdminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
AdminUserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("AdminUser", AdminUserSchema);
