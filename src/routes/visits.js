const express = require("express");
const router = express.Router();
const visitsController = require("../controllers/visits");

router.get("/", visitsController.getVisits);
router.post("/", visitsController.insertVisits);
router.put("/", visitsController.updateVisits);
router.delete("/:idVisit", visitsController.deleteVisits);

module.exports = router;
