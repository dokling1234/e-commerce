const Order = require("../models/order");
const Product = require("../models/product");
const knapsack = require("../helper/knapsack");

// createOrder
const createOrder = async (req, res) => {
  try {
    const { buyerName, buyerEmail, items, proofOfPayment } = req.body;

    let subtotal = 0;
    let totalImpact = { meals: 0, scholarships: 0, reliefPacks: 0 };

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

      item.unitPrice = product.price;
    }

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
      status: "pending" 
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// getAll
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.productId", "title price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel Order
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.qty } });
      }
      order.paymentStatus = "failed"; 
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//pending => to receive
const markOrderToReceive = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.qty } });
      }
      order.paymentStatus = "failed"; 
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (order.paymentStatus === "paid" && order.status === "pending") {
      order.status = "to receive";
    }

    if (status && status !== "to receive") order.status = status;

    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//to receive => received
const markOrderReceived = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

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

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const calcImpactScore = (impact) => {
  return (impact.meals * 0.5) + (impact.scholarships * 2) + (impact.reliefPacks * 1.5);
};

const generateBundle = async (req, res) => {
  try {
    const { budget, category } = req.body;

    let query = { active: true };
    if (category && category !== "All") query.category = category;

    const products = await Product.find(query);

    // Convert products to {title, price, score, ...}
    const scoredProducts = products.map((p) => {
      const impactScore = calcImpactScore(p.impact);
      const score = (p.perceivedValue * 0.6) + (impactScore * 0.4);
      return {
        _id: p._id,
        title: p.title,
        price: p.price,
        score,
        impact: p.impact,
        perceivedValue: p.perceivedValue,
      };
    });

    const result = knapsack(scoredProducts, budget);

    res.json({
      success: true,
      budget,
      bestScore: result.bestScore,
      bundle: result.bundle,
      totalSpent: result.bundle.reduce((sum, item) => sum + item.price, 0),
      remaining: budget - result.bundle.reduce((sum, item) => sum + item.price, 0),
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating bundle", error: err.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, markOrderToReceive, markOrderReceived, deleteOrder, generateBundle };
