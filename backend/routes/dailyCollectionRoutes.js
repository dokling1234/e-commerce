const express = require("express");
const router = express.Router();
const { saveDailyCollection, getDailyCollections } = require("../controllers/dailyCollectionController");

router.post("/", saveDailyCollection);
router.get("/", getDailyCollections);

module.exports = router;
