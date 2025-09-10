const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleWare");
const logActivity = require("../middleware/activityLogger");
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

//admin routes
router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, logActivity("Add Product"), addProduct);
router.put("/:id", authMiddleware, logActivity("Update Product"), updateProduct);
router.delete("/:id", authMiddleware, logActivity("Delete Product"), deleteProduct);

module.exports = router;
