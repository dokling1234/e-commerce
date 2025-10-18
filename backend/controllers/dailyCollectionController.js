const DailyCollection = require("../models/DailyCollection");

// Save Daily Collection
const saveDailyCollection = async (req, res) => {
  try {
    const newRecord = new DailyCollection(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Daily collection saved", data: newRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save collection", error: err.message });
  }
};

// Get All Records
const getDailyCollections = async (req, res) => {
  try {
    const records = await DailyCollection.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

module.exports = {getDailyCollections, saveDailyCollection}