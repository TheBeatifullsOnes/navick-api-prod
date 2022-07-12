const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const paymentsController = require("../controllers/payments");

router.get(
  "/byWeek",
  auth.ensureAuthenticated,
  paymentsController.getPaymentsByWeek
);
router.get(
  "/byDay/:selectedDate",
  auth.ensureAuthenticated,
  paymentsController.getPaymentsByDay
);
router.get(
  "/paymentsByRoute/:idRoute",
  auth.ensureAuthenticated,
  paymentsController.getPaymentsByRoute
);
router.get("/", auth.ensureAuthenticated, paymentsController.getPayments);
router.get(
  "/:idInvoice",
  auth.ensureAuthenticated,
  paymentsController.getPaymentsByIdInvoice
);
router.post(
  "/",
  auth.ensureAuthenticated,
  paymentsController.addPaymentUpdateRemainingPayment
);
router.put("/", auth.ensureAuthenticated, paymentsController.updateTicket);

module.exports = router;
