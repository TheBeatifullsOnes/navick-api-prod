const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const detailsInvoicesController = require("../controllers/detailsInvoices");

router.post(
  "/",
  auth.ensureAuthenticated,
  detailsInvoicesController.getInvoicesDetailsById
);

module.exports = router;
