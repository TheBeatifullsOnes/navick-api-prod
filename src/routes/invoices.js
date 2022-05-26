const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoices");

router.get("/getInvoicesByCurrentDay/:idRoute", invoiceController.getInvoicesByCurrentDay)
router.get("/", invoiceController.getInvoices);
router.get("/:idInvoice", invoiceController.getInvoice);
router.post("/", invoiceController.addInvoice);
router.put("/", invoiceController.updateInvoice);
router.get("/only/:idRoute", invoiceController.getInvoicesByRoute);
router.post("/cancel", invoiceController.cancelInvoices)

module.exports = router;
