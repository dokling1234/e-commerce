const router = require("express").Router();
const {authMiddleware} = require("../middleware/authMiddleWare");
const logActivity = require("../middleware/activityLogger");
const upload = require("../middleware/upload.js");

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getRandomProducts,
  getCustomerProducts
} = require("../controllers/productController");
//customer routes
router.get("/customer", getCustomerProducts);
router.get("/random", getRandomProducts);
router.get("/:id", getSingleProduct);

//admin routes
router.get("/", authMiddleware, getProducts);
router.post(
  "/",
  authMiddleware,
  logActivity("Add Product"),
  upload.array("images", 5), 
  addProduct
);
router.put(
  "/:id",
  authMiddleware,
  logActivity("Update Product"),
  updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  logActivity("Delete Product"),
  deleteProduct
);

module.exports = router;
