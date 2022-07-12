const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const rutasController = require("../controllers/routes");

router.get("/", auth.ensureAuthenticated, rutasController.listaRutas);
router.post("/", auth.ensureAuthenticated, rutasController.insertaRuta);
router.put("/", auth.ensureAuthenticated, rutasController.actualizaRuta);
router.delete(
  "/:idRoute",
  auth.ensureAuthenticated,
  rutasController.eliminaRuta
);

module.exports = router;
