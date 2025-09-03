const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  active: { type: Boolean, default: true }, // active/inactive 
  status: { type: String, enum: ["active", "on hold"], default: "active" } 
}, { timestamps: true });

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);