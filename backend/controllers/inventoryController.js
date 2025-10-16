const Inventory = require("../models/inventory");

// Get all inventory items
const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add new inventory item
const addInventory = async (req, res) => {
  try {
    const { itemName, description, price, quantity, category, arRef } = req.body;
    console.log(req.body);
    const item = new Inventory({
      itemName,
      description,
      price,
      quantity,
      category,
      arRef,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update inventory item
const updateInventory = async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete inventory item
const deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Inventory item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
};
