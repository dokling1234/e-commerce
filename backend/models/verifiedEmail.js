const mongoose = require("mongoose");

const VerifiedEmailSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  verifiedUntil: { type: Date },
});

module.exports = mongoose.model("VerifiedEmail", VerifiedEmailSchema);