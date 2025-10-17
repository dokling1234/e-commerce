
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  type: { type: String, default: "new_order" }, 
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  message: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports  = mongoose.model("Notification", NotificationSchema);