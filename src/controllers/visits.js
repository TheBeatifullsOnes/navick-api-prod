import * as model from "../models/visits.js";
import logger from "../utils/logger.js";

export const getVisits = (req, res) => {
  model
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

export const insertVisits = (req, res) => {
  const { idClient, idUser, idInvoice, comments, textTicket, gpsLocation } =
    req.body;
  const moment = req.timestamp;
  const timestamp = moment
    .tz("America/Mexico_City")
    .format("YYYY-MM-DD HH:mm:ss");
  console.log(timestamp, "soy la insercion del tmstp");
  model
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

export const updateVisits = (req, res) => {
  const { comments, textTicket, printedTicket, idVisit } = req.body;
  model
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

export const deleteVisits = (req, res) => {
  const { idVisit } = req.params;
  model
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
