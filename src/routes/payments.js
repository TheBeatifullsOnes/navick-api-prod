const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments");

router.get("/byWeek", paymentsController.getPaymentsByWeek);
router.get("/byDay/:selectedDate", paymentsController.getPaymentsByDay);
router.get("/paymentsByRoute/:idRoute", paymentsController.getPaymentsByRoute);
router.get("/", paymentsController.getPayments);
router.get("/:idInvoice", paymentsController.getPaymentsByIdInvoice);
router.put("/", paymentsController.addPaymentUpdateRemainingPayment);
// router.put("/", paymentsController.updateTicket);

module.exports = router;
