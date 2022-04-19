const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/users");

/* GET users listing. */
router.get("/", usuarioController.listaUsuarios);
router.get("/:idUser", usuarioController.listaUsuario);
router.post("/", usuarioController.insertaUsuario);
router.put("/", usuarioController.actualizaUsuario);
router.delete("/:idUser", usuarioController.eliminaUsuario);

module.exports = router;
