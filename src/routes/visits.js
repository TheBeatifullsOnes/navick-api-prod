const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const visitsController = require("../controllers/visits");

router.get("/", auth.ensureAuthenticated, visitsController.getVisits);
router.post("/", auth.ensureAuthenticated, visitsController.insertVisits);
router.put("/", auth.ensureAuthenticated, visitsController.updateVisits);
router.delete(
  "/:idVisit",
  auth.ensureAuthenticated,
  visitsController.deleteVisits
);

module.exports = router;
