import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";
import * as invoiceController from "../controllers/invoices.js";

const routesInvoices = express.Router();

routesInvoices.get(
  "/getInvoicesByCurrentDay/:idRoute",
  ensureAuthenticated,
  invoiceController.getInvoicesByCurrentDay
);
routesInvoices.get("/", ensureAuthenticated, invoiceController.getInvoices);
routesInvoices.get(
  "/:idInvoice",
  ensureAuthenticated,
  invoiceController.getInvoice
);
routesInvoices.post("/", ensureAuthenticated, invoiceController.addInvoice);
routesInvoices.put("/", ensureAuthenticated, invoiceController.updateInvoice);
routesInvoices.get(
  "/only/:idRoute",
  ensureAuthenticated,
  invoiceController.getInvoicesByRoute
);
routesInvoices.post(
  "/cancel",
  ensureAuthenticated,
  invoiceController.cancelInvoices
);

export default routesInvoices;
