const router = require("express").Router();
const { addBeneficiary, updateBeneficiaryStatus } = require("../controllers/beneficiaryController");

router.post("/", addBeneficiary);
router.post("/:id/status", updateBeneficiaryStatus);

module.exports = router;
