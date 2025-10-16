const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: String,
  price: Number,
  quantity: Number,
  category: String,
  arRef: String
});

module.exports = mongoose.model("Inventory", inventorySchema);
