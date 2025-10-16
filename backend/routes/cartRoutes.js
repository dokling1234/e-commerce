const router = require("express").Router();
const { getCart, addCart, removeCart, clearCart } = require("../controllers/cartController");


router.post("/add",  addCart);
router.get("/get",  getCart);
router.post("/remove",  removeCart);
router.post("/clear", clearCart);


module.exports = router;
