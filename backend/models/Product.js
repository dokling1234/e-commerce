const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: String,
  category: { type: String, default: "Other" },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"], default: "M" }, 
  images: [String], 
  perceivedValue: { type: Number, default: 0.5 }, // value for impact?
  impact: {
    meals: { type: Number, default: 0 },
    scholarships: { type: Number, default: 0 },
    reliefPacks: { type: Number, default: 0 }
  },
  active: { type: Boolean, default: true },
  arRef: { type: String, required: true, unique: true } 
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);

