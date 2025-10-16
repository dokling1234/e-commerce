// controllers/adminAnalyticsController.js

const Order = require("../models/Order");
const Product = require("../models/product");

const getAnalytics = async (req, res) => {

  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    const salesData = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" }, paymentStatus: "paid" } },
      { $group: { _id: null, totalSales: { $sum: "$subtotal" } } }
    ]);
    const totalRunningSales = salesData[0]?.totalSales || 0;

    const inventoryData = await Product.aggregate([
      { $group: { _id: null, totalInventory: { $sum: "$quantity" } } }
    ]);
    const totalInventory = inventoryData[0]?.totalInventory || 0;

    const soldData = await Order.aggregate([
      { $match: { status: "received" } },
      { $unwind: "$items" },
      { $group: { _id: null, totalSold: { $sum: "$items.qty" } } }
    ]);
    const totalSold = soldData[0]?.totalSold || 0;

    return res.json({
      success: true,
      data: {
        totalOrders,
        totalInventory,
        pendingOrders,
        totalSold,
        totalRunningSales
      }
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
      error: error.message
    });
  }
};
module.exports = { getAnalytics };
