const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const advisorController = require("../controllers/advisor");

router.post("/", auth.ensureAuthenticated, advisorController.insertAdvisor);
router.put("/", auth.ensureAuthenticated, advisorController.updateAdvisor);
router.delete(
  "/:idAsesor",
  auth.ensureAuthenticated,
  advisorController.deleteAdvisor
);

module.exports = router;
