const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoices");

router.get("/", invoiceController.getInvoices);
router.get("/:idInvoice", invoiceController.getInvoice);
router.post("/create", invoiceController.addInvoice);
router.put("/update", invoiceController.updateInvoice);
router.get("/only/:idRoute", invoiceController.getInvoicesByRoute);

module.exports = router;
