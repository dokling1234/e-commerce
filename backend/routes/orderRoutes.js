const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleWare");
const logActivity = require("../middleware/activityLogger");
const { createOrder, getOrders, updateOrderStatus, deleteOrder, markOrderToReceive, markOrderReceived, generateBundle  } = require("../controllers/orderController");

//client
router.post("/", createOrder);

//Admin: orderRoutes
router.get("/", authMiddleware, getOrders);
router.put("/:id", authMiddleware, logActivity("Cancelled Order"), updateOrderStatus);
router.put("/:id/to-receive", authMiddleware, logActivity("To Receive Order"), markOrderToReceive);
router.put("/:id/received", authMiddleware, logActivity("Received Order"), markOrderReceived);
router.post("/bundle", generateBundle);
router.delete("/:id", authMiddleware, logActivity("Delete Order"), deleteOrder);

module.exports = router;
