const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleWare");
const logActivity = require("../middleware/activityLogger");
const { createOrder, getOrders, updateOrderStatus, deleteOrder, markOrderToReceive, markOrderReceived, generateBundle, verifyOrderOTP, createManualOrder  } = require("../controllers/orderController");

//client
router.post("/", createOrder);
router.post("/verify-otp", verifyOrderOTP);

//Admin: orderRoutes
router.get("/", authMiddleware, getOrders);
router.put("/:id", authMiddleware, logActivity("Cancelled Order"), updateOrderStatus);
router.put("/:id/to-receive", authMiddleware, logActivity("To Receive Order"), markOrderToReceive);
router.put("/:id/received", authMiddleware, logActivity("Received Order"), markOrderReceived);
router.post("/bundle", generateBundle);
router.delete("/:id", authMiddleware, logActivity("Delete Order"), deleteOrder);
router.post("/manual-order", authMiddleware, logActivity("Create Manual Order"), createManualOrder);


module.exports = router;
