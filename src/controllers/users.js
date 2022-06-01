const usuariosModel = require("../models/users");
const bcrypt = require("bcryptjs");

exports.listaUsuarios = (req, res) => {
  console.log("test");
  usuariosModel
    .obtenerUsuarios()
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "no hay usuarios por mostrar",
        });
      }
    })
    .catch((error) => res.statusCode(500).json(error));
};

exports.updateUserStatus = (req, res) => {
  const { idUser, status } = req.body;
  console.log("aca es el req.body", req.body);
  usuariosModel
    .updateUserStatus(idUser, status)
    .then((sqlResult) => {
      if (sqlResult.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "Status del usuario actualizado correctamente",
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "success",
          result: "Error al actualizar",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.listaUsuario = (req, res) => {
  const { idUser } = req.params;
  usuariosModel
    .obtenerUsuario(idUser)
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "el usuario no existe",
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.insertaUsuario = async (req, res) => {
  const { username, name, idUserType, password, idRoute } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  usuariosModel
    .insertarUsuario(username, name, idUserType, hashPassword, idRoute)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(201).json({
          statusCode: 201,
          statusMessage: "success",
          result: "asesor insertado correctamente",
        });
      } else if (response.error) {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: response,
        });
      }
    })
    .catch((error) => {
      res
        .statusCode(500)
        .json({ statusCode: 500, statusMessage: "error", result: error });
    });
};

exports.actualizaUsuario = async (req, res) => {
  const { username, name, idUserType, password, status, idRoute } = req.body;
  let hashPassword = ""
  if (password !== "") {
    hashPassword = await bcrypt.hash(password, 10);
  }
  usuariosModel
    .actualizarUsuario(
      username,
      name,
      idUserType,
      hashPassword,
      status,
      idRoute
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "usuario actualiza correctamente",
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "error al actualizar el usuario",
        });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ statusCode: 500, statusMessage: "error", result: error });
    });
};

exports.eliminaUsuario = async (req, res) => {
  const { idUser } = req.params;
  usuariosModel
    .eliminarUsuario(idUser)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "asesor eliminado correctamente",
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "error al eliminar el asesor",
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.getUsersType = async (req, res) => {
  usuariosModel
    .getUsersType()
    .then((sqlResult) => {
      if (sqlResult) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: sqlResult,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "error al obtener los tipos de usuarios",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};
