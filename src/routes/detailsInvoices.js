const express = require("express");
const router = express.Router();
const detailsInvoicesController = require("../controllers/detailsInvoices");

router.post("/", detailsInvoicesController.getInvoicesDetailsById);

module.exports = router;
