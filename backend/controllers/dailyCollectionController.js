const DailyCollection = require("../models/DailyCollection");

// Save Daily Collection
const saveDailyCollection = async (req, res) => {
  try {
    const newRecord = new DailyCollection(req.body);
    await newRecord.save();
    res
      .status(201)
      .json({ message: "Daily collection saved", data: newRecord });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to save collection", error: err.message });
  }
};

// Get All Records
const getDailyCollections = async (req, res) => {
  try {
    const { date, branch } = req.query; // /api/dailycollection?date=2025-12-31&branch=this
    const filter = {};

    if (date) {
      filter.date = date; // match string directly
    }

    if (branch) filter.branch = branch;

    const records = await DailyCollection.find(filter).sort({ createdAt: -1 });
    const allBranches = await DailyCollection.distinct("branch");

    res.json({ records, branches: allBranches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};



// GET /api/dailycollection?date=2025-12-31&branch=Main

const getPastCollections = async (req, res) => {
  try {
    const { date, branch } = req.query;

    if (!date || !branch) {
      return res.status(400).json({ message: "Date and Branch are required" });
    }

    const records = await DailyCollection.find({ date, branch });

    if (!records.length) {
      return res.status(404).json({ message: "No records found" });
    }

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getDailyCollections,
  saveDailyCollection,
  getPastCollections,
};
