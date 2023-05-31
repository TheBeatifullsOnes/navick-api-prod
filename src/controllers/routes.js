import * as rutasModel from "../models/routes.js";
import logger from "../utils/logger.js";

export const listaRutas = function (req, res) {
  rutasModel
    .listaRutas()
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
        logger.info(`${res}`);
      } else {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "no hay rutas por mostrar",
        });
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

export const insertaRuta = function (req, res, next) {
  const { description } = req.body;
  rutasModel
    .insertaRuta(description)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(201).json({
          statusCode: 201,
          statusMessage: "success",
          result: "ruta insertada correctamente",
        });
      } else if (response.error) {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: response,
        });
      }
    })
    .catch((error) => {
      res.status({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

export const actualizaRuta = function (req, res, next) {
  const { idRoute, description, state } = req.body;
  rutasModel
    .actualizaRuta(idRoute, description, state)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "ruta actualizada correctamente",
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "error al actualizar la ruta",
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

export const eliminaRuta = function (req, res) {
  const { idRoute } = req.params;
  rutasModel
    .eliminaRuta(idRoute)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "ruta eliminada correctamente",
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "el id de ruta que quieres eliminar no existe",
        });
      }
    })
    .catch((error) =>
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      })
    );
};
