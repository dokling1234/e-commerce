const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // Existing buyer details
    buyerName: String,  // Can be generated as `${firstName} ${lastName}`
    buyerEmail: String,

    // ✅ Additional Customer Contact Info
    customer: {
      firstName: String,
      lastName: String, 
      phone: String,
    },

    // ✅ Order Type
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },

    // ✅ Address (only used if delivery)
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },

    // Existing items
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        unitPrice: Number,
      },
    ],

    subtotal: Number,

    // ✅ Payment Mode
    paymentMethod: {
      type: String,
      enum: ["gcash", "cash"],
      default: "gcash",
    },

    // ✅ GCash details
    referenceNumber: String,
    proofOfPayment: String, // keep this as receipt URL or file path

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "to receive", "received", "cancelled"],
      default: "pending",
    },

    trackingNumber: String,

    impact: {
      meals: { type: Number, default: 0 },
      scholarships: { type: Number, default: 0 },
      reliefPacks: { type: Number, default: 0 },
    },

    otp: String,
    otpExpires: Date,

    ticketVoucher: {
      code: String,
      expiresAt: Date,
    },

    purchaseMethod: {
      type: String,
      enum: ["online", "walk-in"],
      required: true,
      default: "online",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
