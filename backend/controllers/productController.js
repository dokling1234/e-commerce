const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
//getAll
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

//get for customer - only available stock
const getCustomerProducts = async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $gt: 0 } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
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

//getRandomProducts - for suggestions
const getRandomProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4; // Default to 4 products
    
    console.log("Fetching random products with limit:", limit);
    
    // First try aggregation
    let products = await Product.aggregate([
      { $match: { quantity: { $gt: 0 } } }, // Only products with quantity > 0
      { $sample: { size: limit } } // Random sample
    ]);
    
    console.log("Aggregation result:", products.length, "products found");
    
    // If no products found with aggregation, fallback to regular find
    if (products.length === 0) {
      console.log("No products found with aggregation, trying regular find");
      const allProducts = await Product.find({ quantity: { $gt: 0 } });
      console.log("All available products:", allProducts.length);
      
      // Shuffle and take first 4
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      products = shuffled.slice(0, limit);
      console.log("Fallback result:", products.length, "products");
    }
    
    res.json(products);
  } catch (err) {
    console.error("Error in getRandomProducts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct, getSingleProduct, getRandomProducts, getCustomerProducts };
