const mongoose = require("mongoose");

const dailyCollectionSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  date: { type: String, required: true },

  rows: [
    {
      arRef: String,
      item: String,
      qty: Number,
      amount: Number,
      total: Number,
      cash: Number,
      gcash: Number,
      discount: String,
      reason: String,
      approver: String,
    }
  ],

  grandTotal: Number,
  preparedBy: String,
  notedBy: String,
  validatedBy: String,
}, { timestamps: true });

module.exports = mongoose.model("DailyCollection", dailyCollectionSchema);
