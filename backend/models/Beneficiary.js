const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true }, // general active/inactive flag
  status: { type: String, enum: ["active", "on hold"], default: "active" } // scholarship status
}, { timestamps: true });

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);