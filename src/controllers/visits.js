const visitsModel = require("../models/visits");
const logger = require("../utils/logger");
exports.getVisits = (req, res) => {
  visitsModel
    .getVisits()
    .then((sqlResult) => {
      logger.info("Solicitando las visitas en la BD");
      if (sqlResult.length === 0) {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "no hay registros de visitas",
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: sqlResult,
        });
      }
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.insertVisits = (req, res) => {
  const { idClient, idUser, idInvoice, comments, textTicket, gpsLocation } =
    req.body;
  const moment = req.timestamp;
  const timestamp = moment.tz("America/Mexico_City").format();
  visitsModel
    .insertVisits(
      idClient,
      idUser,
      idInvoice,
      comments,
      textTicket,
      gpsLocation,
      timestamp
    )
    .then((sqlResult) => {
      if (!sqlResult) {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "no hay registros de visitas",
        });
      }
      res.status(200).json({
        statusCode: 200,
        statusMessage: "success",
        result: { command: sqlResult.command, rowCount: sqlResult.rowCount },
      });
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.updateVisits = (req, res) => {
  const { comments, textTicket, printedTicket, idVisit } = req.body;
  visitsModel
    .updateVisits(comments, textTicket, printedTicket, idVisit)
    .then((sqlResult) => {
      if (!sqlResult) {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "no hay registros de visitas",
        });
      }
      res.status(200).json({
        statusCode: 200,
        statusMessage: "success",
        result: { command: sqlResult.command, rowCount: sqlResult.rowCount },
      });
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.deleteVisits = (req, res) => {
  const { idVisit } = req.params;
  visitsModel
    .deleteVisits(idVisit)
    .then((sqlResult) => {
      if (sqlResult.rowCount === 0) {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "no hay registros de visitas",
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: { command: sqlResult.command, rowCount: sqlResult.rowCount },
        });
      }
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};
