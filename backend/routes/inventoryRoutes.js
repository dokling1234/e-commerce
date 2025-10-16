const express = require("express");
const {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getInventory);
router.post("/", addInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

module.exports = router;
