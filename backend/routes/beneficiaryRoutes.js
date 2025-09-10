const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleWare");
const logActivity = require("../middleware/activityLogger");
const {
  addBeneficiary,
  updateBeneficiaryStatus,
  getAllBeneficiaries,
} = require("../controllers/beneficiaryController");

router.get("/",authMiddleware, getAllBeneficiaries);
router.post("/add",authMiddleware, logActivity("Added Beneficiary"), addBeneficiary);
router.post(
  "/:id/status",authMiddleware,
  logActivity((req) => `Changed status to "${req.body.status}"`),//fix
  updateBeneficiaryStatus
);
module.exports = router;
