const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB(); // 

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-Commerce API is running.");
});


//routes
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/beneficiaries", beneficiaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
