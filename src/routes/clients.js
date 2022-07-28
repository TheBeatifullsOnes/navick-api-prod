import express from "express";
import * as clientController from "../controllers/clients.js";
import { ensureAuthenticated } from "../middlewares/auth.js";
const routesClients = express.Router();

routesClients.get(
  "/auditReports/:idRoute",
  ensureAuthenticated,
  clientController.getAuditReportByRoute
);
routesClients.get(
  "/remainingPayment",
  ensureAuthenticated,
  clientController.getClientCreditInformation
);
routesClients.post(
  "/massiveUpdate",
  ensureAuthenticated,
  clientController.massiveUpdateRouteClients
);
routesClients.get(
  "/only/:idRoute",
  ensureAuthenticated,
  clientController.getOnlyClientsByRoute
);
routesClients.get(
  "/:idCliente",
  ensureAuthenticated,
  clientController.obtenerCliente
);
routesClients.get(
  "/ruta/:idRoute",
  ensureAuthenticated,
  clientController.getClientsByRoute
);
routesClients.post("/", ensureAuthenticated, clientController.insertaCliente);
routesClients.put("/", ensureAuthenticated, clientController.actualizaCliente);
routesClients.post(
  "/:idCliente",
  ensureAuthenticated,
  clientController.updateClientStatus
);
routesClients.get("/", ensureAuthenticated, clientController.obtenerClientes);
routesClients.delete(
  "/:idClient",
  ensureAuthenticated,
  clientController.deleteClient
);

export default routesClients;
