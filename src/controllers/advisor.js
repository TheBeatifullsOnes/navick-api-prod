const advisorModel = require("../models/advisor");
const logger = require("../utils/logger");

exports.getAdvisors = function (req, res) {
  advisorModel
    .getAdvisors()
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
          result: "no hay asesores por mostrar",
        });
      }
    })
    .catch((error) => res.status(500).json(error));
};

exports.insertAdvisor = (req, res) => {
  const { idAdvisor, name, idRoute, status, dateEdited, idUserEdit, idUser } =
    req.body;
  advisorModel
    .insertAdvisor(
      idAdvisor,
      name,
      idRoute,
      status,
      dateEdited,
      idUserEdit,
      idUser
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(201).json({
          statusCode: 201,
          statusMessage: "ok",
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
    .catch((error) => res.status(404).json(error));
};

exports.updateAdvisor = (req, res) => {
  const { idAdvisor, name, idRoute, status, dateEdited, idUserEdit, idUser } =
    req.body;
  advisorModel
    .updateAdvisor(
      idAdvisor,
      name,
      idRoute,
      status,
      dateEdited,
      idUserEdit,
      idUser
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "ok",
          result: "asesor actualizado correctamente",
        });
      } else {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "error al actualizar el asesor",
        });
      }
    })
    .catch((error) => res.status(500).json(error));
};

exports.deleteAdvisor = (req, res) => {
  const { idAsesor } = req.params;
  advisorModel
    .deleteAdvisor(idAsesor)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "ok",
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
