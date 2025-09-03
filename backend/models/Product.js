const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: "Other" },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: String,
  perceivedValue: { type: Number, default: 0.5 }, // value
  impact: {
    meals: { type: Number, default: 0 },
    scholarships: { type: Number, default: 0 },
    reliefPacks: { type: Number, default: 0 }
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
