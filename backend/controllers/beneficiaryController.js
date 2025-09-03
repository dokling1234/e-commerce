const Beneficiary = require("../models/beneficiary");

// Add Beneficiary
const addBeneficiary = async (req, res) => {
  try {
    const { name, status, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: "Name and age are required" });
    }

    // Check if beneficiary already exists
    const existing = await Beneficiary.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Beneficiary with this name already exists" });
    }

    const newBeneficiary = new Beneficiary({
      name: name.trim(),
      age,
      status: status || "active"
    });

    await newBeneficiary.save();

    res.status(201).json({ message: "Beneficiary added successfully", beneficiary: newBeneficiary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const updateBeneficiaryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "on hold"].includes(status)) {
      return res.status(400).json({ message: 'Status must be "active" or "on hold"' });
    }

    const beneficiary = await Beneficiary.findById(id);
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    beneficiary.status = status;
    await beneficiary.save();

    res.json({ message: `Beneficiary status updated to "${status}"`, beneficiary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 }); // latest first
    res.json({ message: "All beneficiaries", beneficiaries });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addBeneficiary, updateBeneficiaryStatus, getAllBeneficiaries };
