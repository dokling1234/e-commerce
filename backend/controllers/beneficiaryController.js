const Beneficiary = require("../models/beneficiary");

// Add 
const addBeneficiary = async (req, res) => {
  try {
    const newBeneficiary = new Beneficiary(req.body); // save all fields from req.body
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

const editBeneficiaryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure age is number if provided
    if (updates.age) updates.age = Number(updates.age);

    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedBeneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    res.status(200).json({
      message: "Beneficiary updated successfully",
      beneficiary: updatedBeneficiary,
    });
  } catch (err) {
    console.error("Failed to update beneficiary:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = { addBeneficiary, updateBeneficiaryStatus, getAllBeneficiaries, editBeneficiaryDetails };
