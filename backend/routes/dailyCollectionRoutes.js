const express = require("express");
const router = express.Router();
const { saveDailyCollection, getDailyCollections, getPastCollections } = require("../controllers/dailyCollectionController");

router.post("/", saveDailyCollection);
router.get("/", getDailyCollections);
router.get("/pastcollection", getPastCollections); 

module.exports = router;
