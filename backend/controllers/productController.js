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
    const { itemName, description, price, quantity, category, arRef } =
      req.body;
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
      itemName,
      description,
      price,
      quantity,
      category,
      images, // array of image URLs
      arRef,
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


const getSingleProduct =  async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct, getSingleProduct };
