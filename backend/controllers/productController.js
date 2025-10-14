const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
//getAll
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
//addProduct
const addProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, category } = req.body;

    // Upload multiple images to Cloudinary
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push(result.secure_url);
      }
    }

    const product = new Product({
      title,
      description,
      price,
      quantity,
      category,
      images, // array of image URLs
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//updateProduct
const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
};
//deleteProduct
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
