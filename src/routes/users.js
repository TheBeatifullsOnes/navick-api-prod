const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usuarioController = require("../controllers/users");

/* GET users listing. */
router.get("/tipo", auth.ensureAuthenticated, usuarioController.getUsersType);
router.post(
  "/updateStatus",
  auth.ensureAuthenticated,
  usuarioController.updateUserStatus
);
router.get("/", auth.ensureAuthenticated, usuarioController.listaUsuarios);
router.get(
  "/:idUser",
  auth.ensureAuthenticated,
  usuarioController.listaUsuario
);
router.post("/", auth.ensureAuthenticated, usuarioController.insertaUsuario);
router.put("/", auth.ensureAuthenticated, usuarioController.actualizaUsuario);
router.delete(
  "/:idUser",
  auth.ensureAuthenticated,
  usuarioController.eliminaUsuario
);

module.exports = router;
