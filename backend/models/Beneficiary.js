const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  contactNumber: { type: String },
  email: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String },
  emergencyName: { type: String },
  emergencyNumber: { type: String },
  relationship: { type: String },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
  registrationDate: { type: Date, default: Date.now },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);
