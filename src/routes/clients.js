const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clients");

router.get("/auditReports/:idRoute", clientController.getAuditReportByRoute);
router.get("/remainingPayment", clientController.getClientCreditInformation);
router.post("/massiveUpdate", clientController.massiveUpdateRouteClients);
router.get("/only/:idRoute", clientController.getOnlyClientsByRoute);
router.get("/:idCliente", clientController.obtenerCliente);
router.get("/ruta/:idRoute", clientController.getClientsByRoute);
router.post("/", clientController.insertaCliente);
router.put("/", clientController.actualizaCliente);
router.post("/:idCliente", clientController.updateClientStatus);
router.get("/", clientController.obtenerClientes);
router.delete("/:idClient", clientController.deleteClient);

module.exports = router;
