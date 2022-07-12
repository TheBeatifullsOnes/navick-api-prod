const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const invoiceController = require("../controllers/invoices");

router.get(
  "/getInvoicesByCurrentDay/:idRoute",
  auth.ensureAuthenticated,
  invoiceController.getInvoicesByCurrentDay
);
router.get("/", auth.ensureAuthenticated, invoiceController.getInvoices);
router.get(
  "/:idInvoice",
  auth.ensureAuthenticated,
  invoiceController.getInvoice
);
router.post("/", auth.ensureAuthenticated, invoiceController.addInvoice);
router.put("/", auth.ensureAuthenticated, invoiceController.updateInvoice);
router.get(
  "/only/:idRoute",
  auth.ensureAuthenticated,
  invoiceController.getInvoicesByRoute
);
router.post(
  "/cancel",
  auth.ensureAuthenticated,
  invoiceController.cancelInvoices
);

module.exports = router;
