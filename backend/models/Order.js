dminA// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyerName: String,
  buyerEmail: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: Number,
    unitPrice: Number
  }],
  subtotal: Number,
  proofOfPayment: String, // file upload (URL)
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  trackingNumber: String,
  impact: {
    meals: { type: Number, default: 0 },
    scholarships: { type: Number, default: 0 },
    reliefPacks: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
