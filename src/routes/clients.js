const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clients");
const auth = require("../middlewares/auth");

router.get(
  "/auditReports/:idRoute",
  auth.ensureAuthenticated,
  clientController.getAuditReportByRoute
);
router.get(
  "/remainingPayment",
  auth.ensureAuthenticated,
  clientController.getClientCreditInformation
);
router.post(
  "/massiveUpdate",
  auth.ensureAuthenticated,
  clientController.massiveUpdateRouteClients
);
router.get(
  "/only/:idRoute",
  auth.ensureAuthenticated,
  clientController.getOnlyClientsByRoute
);
router.get(
  "/:idCliente",
  auth.ensureAuthenticated,
  clientController.obtenerCliente
);
router.get(
  "/ruta/:idRoute",
  auth.ensureAuthenticated,
  clientController.getClientsByRoute
);
router.post("/", auth.ensureAuthenticated, clientController.insertaCliente);
router.put("/", auth.ensureAuthenticated, clientController.actualizaCliente);
router.post(
  "/:idCliente",
  auth.ensureAuthenticated,
  clientController.updateClientStatus
);
router.get("/", auth.ensureAuthenticated, clientController.obtenerClientes);
router.delete(
  "/:idClient",
  auth.ensureAuthenticated,
  clientController.deleteClient
);

module.exports = router;
