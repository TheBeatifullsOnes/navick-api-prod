const express = require("express");
const router = express.Router();

const rutasController = require("../controllers/routes");

router.get("/", rutasController.listaRutas);
router.post("/", rutasController.insertaRuta);
router.put("/", rutasController.actualizaRuta);
router.delete("/:idRoute", rutasController.eliminaRuta);

module.exports = router;
