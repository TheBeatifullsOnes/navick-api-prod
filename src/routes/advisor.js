const express = require("express");
const router = express.Router();
const advisorController = require("../controllers/advisor");

router.get("/", advisorController.getAdvisors);
router.post("/", advisorController.insertAdvisor);
router.put("/", advisorController.updateAdvisor);
router.delete("/:idAsesor", advisorController.deleteAdvisor);

module.exports = router;
