const Product = require("../models/Product");

// Add item to cart
const addCart = async (req, res) => {
  const { productId, quantity, image, title, price } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  try {
    const product = await Product.findById(String(productId).trim());
    if (!product || (product.quantity || 0) <= 0) {
      return res.json({
        success: false,
        message: "Out of stock",
        cart: req.session.cart,
      });
    }

    const existing = req.session.cart.find(
      (item) => item.productId === productId
    );

    const addQty = Math.max(1, Number(quantity) || 1);
    const currentInCart = existing?.quantity || 0;
    const availableToAdd = Math.max(0, (product.quantity || 0) - currentInCart);
    const finalAdd = Math.min(addQty, availableToAdd);

    if (finalAdd <= 0) {
      return res.json({
        success: false,
        message: "No more stock available to add",
        cart: req.session.cart,
      });
    }

    // ✅ Only store in session, no DB stock changes
    if (existing) {
      existing.quantity = (existing.quantity || 0) + finalAdd;
    } else {
      req.session.cart.push({
        productId,
        quantity: finalAdd,
        image,
        title,
        price,
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Error adding to cart",
    });
  }

  res.json({ success: true, cart: req.session.cart });
};

// Get cart
const getCart = async (req, res) => {
  res.json({ success: true, cart: req.session.cart || [] });
};

// Remove item
const removeCart = async (req, res) => {
  const { productId } = req.body;

  if (!req.session.cart) {
    return res.json({ success: false, message: "Cart is empty" });
  }

  try {
    // Find the item being removed
    const itemToRemove = req.session.cart.find(
      (item) => item.productId === productId
    );



    // ✅ Remove from cart session
    req.session.cart = req.session.cart.filter(
      (item) => item.productId !== productId
    );

    res.json({ success: true, cart: req.session.cart });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error removing from cart" });
  }
};

const clearCart = (req, res) => {
  req.session.cart = [];
  res.json({ success: true });
};

module.exports = { addCart, getCart, removeCart, clearCart };
