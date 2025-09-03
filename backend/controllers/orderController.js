const Order = require("../models/order");
const Product = require("../models/product");

// User creates order
const createOrder = async (req, res) => {
  try {
    const { buyerName, buyerEmail, items, proofOfPayment } = req.body;

    // subtotal + impact
    let subtotal = 0;
    let totalImpact = { meals: 0, scholarships: 0, reliefPacks: 0 };

    // Check stock availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (item.qty > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}. Available: ${product.quantity}`
        });
      }

      subtotal += product.price * item.qty;
      totalImpact.meals += product.impact.meals * item.qty;
      totalImpact.scholarships += product.impact.scholarships * item.qty;
      totalImpact.reliefPacks += product.impact.reliefPacks * item.qty;

      // Save unitPrice for each item
      item.unitPrice = product.price;
    }

    // Decrement stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.qty } });
    }

    const newOrder = new Order({
      buyerName,
      buyerEmail,
      items,
      subtotal,
      proofOfPayment,
      impact: totalImpact,
      status: "pending" // mark the order as pending
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Admin: get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId", "title price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Handle cancellation: restore stock if status changes to "cancelled"
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.qty } });
      }
      order.paymentStatus = "failed"; // optional: mark payment as failed
    }

    // Update order fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const markOrderToReceive = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Handle cancellation: restore stock if status changes to "cancelled"
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.qty } });
      }
      order.paymentStatus = "failed"; // optional
    }

    // Update paymentStatus if provided
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Automatically move pending → to receive if payment confirmed
    if (order.paymentStatus === "paid" && order.status === "pending") {
      order.status = "to receive";
    }

    // Update status manually if provided (except overriding "to receive" flow)
    if (status && status !== "to receive") order.status = status;

    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const markOrderReceived = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Can only mark as received if current status is "to receive"
    if (order.status !== "to receive") {
      return res.status(400).json({ message: `Order status must be "to receive" to mark as received. Current status: "${order.status}"` });
    }

    order.status = "received";
    await order.save();

    res.json({ message: 'Order status updated to "received"', order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Admin: delete order (optional)
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, markOrderToReceive, markOrderReceived, deleteOrder };
