const Order = require("../models/Order");
const Product = require("../models/product");
const knapsack = require("../helper/knapsack");
const transporter = require("../config/transporter");
const VerifiedEmail = require("../models/verifiedEmail");
const Notification = require("../models/Notification");
const crypto = require("crypto");
const {
  VERIFY_TEMPLATE,
  VOUCHER_TEMPLATE,
} = require("../config/emailTemplate");

// createOrder
const createOrder = async (req, res) => {
  try {
    const {
      buyerName,
      buyerEmail,
      items: rawItems,
      paymentMethod, // cash/gcash
      orderType,     // delivery/pickup
      address,       // for delivery
    } = req.body;

    const proofOfPayment = req.file ? req.file.path : null;

    console.log("Req.body:", req.body);

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required (cash or gcash)" });
    }

    if (paymentMethod === "gcash" && !proofOfPayment) {
      return res.status(400).json({ message: "Proof of payment is required for GCash transactions" });
    }

    if (orderType === "delivery" && !address) {
      return res.status(400).json({ message: "Address is required for delivery" });
    }

    // Build items
    let subtotal = 0;
    let totalImpact = { meals: 0, scholarships: 0, reliefPacks: 0 };
    let items = rawItems;

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch {
        return res.status(400).json({ message: "Invalid items format" });
      }
    }

    for (const item of items) {
      const product = await Product.findById(String(item.productId).trim());
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const quantity = item.quantity || item.qty || 1;
      if (quantity > product.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.title}. Available: ${product.quantity}`,
        });
      }

      subtotal += product.price * quantity;
      totalImpact.meals += product.impact.meals * quantity;
      totalImpact.scholarships += product.impact.scholarships * quantity;
      totalImpact.reliefPacks += product.impact.reliefPacks * quantity;

      item.unitPrice = product.price;
    }

    // --- Always save order first ---
    const newOrder = new Order({
      buyerName,
      buyerEmail,
      items,
      subtotal,
      proofOfPayment,
      impact: totalImpact,
      paymentMethod,
      orderType,
      address: orderType === "delivery" ? address : null,
      status: "pending",
    });

    await newOrder.save();

    // --- Add to notifications ---
    await Notification.create({
      orderId: newOrder._id,
      message: `${buyerName} placed a new order.`,
    });

    // --- Check if email verified ---
    const emailRecord = await VerifiedEmail.findOne({ email: buyerEmail });

    if (!emailRecord || emailRecord.verifiedUntil < new Date()) {
      // Not verified → send OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      newOrder.otp = otp;
      newOrder.otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await newOrder.save();

      const htmlContent = VERIFY_TEMPLATE.replace("{{email}}", buyerEmail).replace("{{otp}}", otp);

      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: buyerEmail,
        subject: "Verify Your Order",
        html: htmlContent,
      });

      console.log("OTP email sent to:", buyerEmail);

      return res.status(200).json({
        message: "OTP sent",
        requiresOtp: true,
        orderId: newOrder._id,
      });
    }

    // Verified → issue voucher
    const voucherCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    const voucherExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    newOrder.ticketVoucher = { code: voucherCode, expiresAt: voucherExpiry };
    await newOrder.save();

    const voucherEmail = VOUCHER_TEMPLATE.replace("{{email}}", buyerEmail).replace("{{otp}}", voucherCode);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: buyerEmail,
      subject: "Your Ticket Voucher",
      html: voucherEmail,
    });

    console.log("Voucher email sent to:", buyerEmail);

    return res.status(200).json({
      success: true,
      voucherCode,
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//manual verify otp
const verifyOrderOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.otpExpires < new Date())
      return res.status(400).json({ message: "OTP expired" });

    if (order.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // Deduct stock for all items
    for (const item of order.items) {
      const qty = item.qty || item.quantity || 1;
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -qty },
      });
    }

    // Store email for 30 days
    const verifiedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await VerifiedEmail.findOneAndUpdate(
      { email: order.buyerEmail },
      { verifiedUntil },
      { upsert: true }
    );

    // Update order status
    order.status = "pending";
    order.otp = null;
    order.otpExpires = null;

    // --- Voucher logic for CASH + PICKUP ---
    if (order.paymentMethod === "cash" && order.orderType === "pickup") {
      const voucherCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      const voucherExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks

      order.ticketVoucher = {
        code: voucherCode,
        expiresAt: voucherExpiry,
      };

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
    }

    await order.save();

    res.json({
      success: true,
      message: "Order confirmed & email remembered",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// getAll
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "items.productId",
      "title itemName price images"
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

    // Move to "to receive" if paid or explicitly requested
    if ((order.paymentStatus === "paid" && order.status === "pending") || status === "to receive") {
      order.status = "to receive";
    } else if (status && status !== "to receive") {
      order.status = status;
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    // Voucher and stock deduction once when entering "to receive" and no voucher yet
    // Deduct here for CASH (pickup) flow; for GCASH flow, deduction happens during OTP verify
    const isCashFlow = order.paymentMethod === "cash";
    if (order.status === "to receive" && !order.ticketVoucher && isCashFlow) {
      // Generate voucher
      const voucherCode = crypto.randomBytes(4).toString("hex").toUpperCase();
      const voucherExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks

      order.ticketVoucher = {
        code: voucherCode,
        expiresAt: voucherExpiry,
      };

      // Voucher check
      console.log("Ticket Voucher");
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
        const qty = item.qty || item.quantity || 1;
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -qty },
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

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

const checkEmailVerified = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let record = await VerifiedEmail.findOne({ email });
    const now = new Date();

    // check existing
    if (record && record.verifiedUntil > now) {
      return res.json({ email, verified: true });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (!record) {
      // new record
      record = new VerifiedEmail({
        email,
        otp,
        otpExpires,
        verifiedUntil: null,
      });
    } else {
      // Update record
      record.otp = otp;
      record.otpExpires = otpExpires;
      record.verifiedUntil = null;
    }
    await record.save();

    const htmlContent = VERIFY_TEMPLATE.replace("{{email}}", email).replace(
      "{{otp}}",
      otp
    );
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your OTP Verification",
      html: htmlContent,
    });

    res.json({ email, verified: false, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
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
  getOrder,
  checkEmailVerified,
};
