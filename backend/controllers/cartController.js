// Add item to cart
const addCart = async (req, res) => {
  const { productId, quantity, image, title, price  } = req.body;
  console.log("Request Body:", req.body); 

  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Check if item already exists
  const existing = req.session.cart.find(
    (item) => item.productId === productId
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    req.session.cart.push({ productId, quantity, image, title, price });
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
  req.session.cart =
    req.session.cart?.filter((item) => item.productId !== productId) || [];
  res.json({ success: true, cart: req.session.cart });
};

const clearCart = (req, res) => {
  req.session.cart = [];
  res.json({ success: true });
};

module.exports = { addCart, getCart, removeCart, clearCart };