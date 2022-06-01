const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments");

router.post("/byDay", paymentsController.getPaymentsByDay);
router.get("/", paymentsController.getPayments);
router.get("/:idInvoice", paymentsController.getPaymentsByIdInvoice);
router.post("/", paymentsController.addPaymentUpdateRemainingPayment);
router.get("/paymentsByRoute/:idRoute", paymentsController.getPaymentsByRoute);
router.put("/", paymentsController.updateTicket);

module.exports = router;
