const Order = require("../models/order");
const Product = require("../models/product");
const knapsack = require("../helper/knapsack");
const transporter = require("../config/transporter"); // your transporter
const crypto = require("crypto");
const {
  VERIFY_TEMPLATE,
  VOUCHER_TEMPLATE,
} = require("../config/emailTemplate");

// createOrder
const createOrder = async (req, res) => {
  try {
    const { buyerName, buyerEmail, items, proofOfPayment } = req.body;

    let subtotal = 0;
    let totalImpact = { meals: 0, scholarships: 0, reliefPacks: 0 };

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (item.qty > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}. Available: ${product.quantity}`,
        });
      }

      subtotal += product.price * item.qty;
      totalImpact.meals += product.impact.meals * item.qty;
      totalImpact.scholarships += product.impact.scholarships * item.qty;
      totalImpact.reliefPacks += product.impact.reliefPacks * item.qty;

      item.unitPrice = product.price;
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit
    const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newOrder = new Order({
      buyerName,
      buyerEmail,
      items,
      subtotal,
      proofOfPayment,
      impact: totalImpact,
      status: "pending",
      otp,
      otpExpires,
    });

    await newOrder.save();

    // Send OTP email
    const htmlContent = VERIFY_TEMPLATE.replace(
      "{{email}}",
      buyerEmail
    ).replace("{{otp}}", otp);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: buyerEmail,
      subject: "Your Order OTP Verification",
      html: htmlContent,
    });

    res.status(201).json({
      message: "Order created, OTP sent to email",
      orderId: newOrder._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//manual verify otp
const verifyOrderOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (order.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Deduct stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.qty },
      });
    }

    order.status = "pending";
    order.otp = null;
    order.otpExpires = null;
    await order.save();

    res.json({ message: "Order confirmed", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// getAll
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "items.productId",
      "title price"
    );
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
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.qty },
        });
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
  console.log("markOrderToReceive called");
  try {
    const { id } = req.params;
    const { status, trackingNumber, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Cancel order logic
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.qty },
        });
      }
      order.paymentStatus = "failed";
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Move to "to receive" if paid
    if (order.paymentStatus === "paid" && order.status === "pending") {
      order.status = "to receive";
    }
    if (status && status !== "to receive") order.status = status;

    if (trackingNumber) order.trackingNumber = trackingNumber;
    console.log(order.ticketVoucher);
    //voucherr
    if (order.status === "to receive" && !order.ticketVoucher === false) {
      // Generate voucher
      console.log("Generated voucehr");
      const voucherCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      const voucherExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks

      order.ticketVoucher = {
        code: voucherCode,
        expiresAt: voucherExpiry,
      };

      // Voucher check
      console.log("Ticket Voucher" );
      console.log("Sending voucher");

      // Send voucher email
      const htmlContent = VOUCHER_TEMPLATE.replace(
        "{{email}}",
        order.buyerEmail
      ).replace("{{otp}}", voucherCode); 

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: order.buyerEmail,
        subject: "Your Voucher Ticket",
        html: htmlContent,
      });

      console.log("Voucher email sent successfully to:", order.buyerEmail);

      // Deduct stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.qty },
        });
      }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error in markOrderToReceive:", err);
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
      return res.status(400).json({
        message: `Order status must be "to receive" to mark as received. Current status: "${order.status}"`,
      });
    }

    order.status = "received";
    await order.save();

    res.json({ message: 'Order status updated to "received"', order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//optional delete
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//impact score
const calcImpactScore = (impact) => {
  return (
    impact.meals * 0.5 + impact.scholarships * 2 + impact.reliefPacks * 1.5
  );
};
//knapsack
const generateBundle = async (req, res) => {
  try {
    const { budget, category } = req.body;

    let query = { active: true };
    if (category && category !== "All") query.category = category;

    const products = await Product.find(query);

    // Convert products to {title, price, score}
    const scoredProducts = products.map((p) => {
      const impactScore = calcImpactScore(p.impact);
      const score = p.perceivedValue * 0.6 + impactScore * 0.4;
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
      remaining:
        budget - result.bundle.reduce((sum, item) => sum + item.price, 0),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating bundle", error: err.message });
  }
};
//Manual walk in
const createManualOrder = async (req, res) => {
  try {
    const { items, proofOfPayment, subtotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalImpact = { meals: 0, scholarships: 0, reliefPacks: 0 };

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });

      if (item.qty > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}. Available: ${product.quantity}`,
        });
      }

      totalImpact.meals += product.impact.meals * item.qty;
      totalImpact.scholarships += product.impact.scholarships * item.qty;
      totalImpact.reliefPacks += product.impact.reliefPacks * item.qty;

      item.unitPrice = product.price;
    }

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.qty },
      });
    }

    const newOrder = new Order({
      buyerName: "Walk-in Customer",
      buyerEmail: "walk-in@store.local",
      items,
      subtotal,
      proofOfPayment,
      impact: totalImpact,
      status: "confirmed",
      paymentStatus: "paid",
      purchaseMethod: "walk-in",
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Manual walk-in order created", order: newOrder });
  } catch (err) {
    console.error("Error creating manual order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createManualOrder,
  createOrder,
  getOrders,
  updateOrderStatus,
  markOrderToReceive,
  markOrderReceived,
  deleteOrder,
  generateBundle,
  verifyOrderOTP,
};
