const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); 

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-Commerce API is running.");
});

//routes
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const staffRoutes = require("./routes/staffRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const userMessagingRoutes = require("./routes/userMessagingRoutes");

app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/beneficiaries", beneficiaryRoutes);
app.use("/api/admin/announcements", announcementRoutes);
app.use("/api/admin/staff", staffRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", userMessagingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
