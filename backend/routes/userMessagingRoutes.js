const router = require("express").Router();
const { sendUserMessage } = require("../controllers/userMessaging");


router.post("/",  sendUserMessage);


module.exports = router;
