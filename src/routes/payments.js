import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";
import * as paymentsController from "../controllers/payments.js";

const routesPayments = express.Router();

routesPayments.get(
  "/byWeek",
  ensureAuthenticated,
  paymentsController.getPaymentsByWeek
);
routesPayments.get(
  "/byDay/:selectedDate",
  ensureAuthenticated,
  paymentsController.getPaymentsByDay
);
routesPayments.get(
  "/paymentsByRoute/:idRoute",
  ensureAuthenticated,
  paymentsController.getPaymentsByRoute
);
routesPayments.get("/", ensureAuthenticated, paymentsController.getPayments);
routesPayments.get(
  "/:idInvoice",
  ensureAuthenticated,
  paymentsController.getPaymentsByIdInvoice
);
routesPayments.post(
  "/",
  ensureAuthenticated,
  paymentsController.addPaymentUpdateRemainingPayment
);
routesPayments.put("/", ensureAuthenticated, paymentsController.updateTicket);

export default routesPayments;
