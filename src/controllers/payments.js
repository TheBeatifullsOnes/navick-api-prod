const paymentsModel = require("../models/payments");
const logger = require("../utils/logger");

exports.getPayments = (req, res) => {
  paymentsModel
    .getAbonos()
    .then((sqlResults) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        result: sqlResults,
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

exports.getPaymentsByIdInvoice = (req, res) => {
  const { idInvoice } = req.params;
  paymentsModel
    .getPaymentsByInvoice(idInvoice)
    .then((sqlResults) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        result: sqlResults,
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

exports.addPaymentUpdateRemainingPayment = async (req, res) => {
  const {
    idInvoice,
    idUser,
    amount,
    locationGPS,
    comments,
    textTicket,
    printedTicket,
  } = req.body;
  const moment = req.timestamp;
  const timestamp = moment
    .tz("America/Mexico_City")
    .format("YYYY-MM-DD HH:mm:ss");
  paymentsModel
    .addPaymentUpdateRemainingPayment(
      idInvoice,
      idUser,
      amount,
      locationGPS,
      comments,
      timestamp,
      textTicket,
      printedTicket
    )
    .then((sqlTransaction) => {
      if (sqlTransaction) {
        res.json({
          statusCode: 200,
          statusMessage: "success",
          result: { message: "Abono agregado correctamente", sqlTransaction },
        });
      } else if (!sqlTransaction) {
        res.json({
          statusCode: 500,
          statusMessage: "error",
          executed: sqlTransaction,
          result: { message: "Error al agregar abono", sqlTransaction },
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

exports.getPaymentsByRoute = (req, res) => {
  const { idRoute } = req.params;
  paymentsModel
    .getPaymentsByRoute(idRoute)
    .then((sqlResults) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        result: sqlResults,
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

exports.updateTicket = (req, res) => {
  const { idPayment, textTicket, printedTicket } = req.body;
  paymentsModel
    .updateTicket(idPayment, textTicket, printedTicket)
    .then((sqlResults) => {
      // if (sqlResults) {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        result: sqlResults,
      });
      // }
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.getPaymentsByDay = (req, res) => {
  const { selectedDate } = req.params;
  paymentsModel
    .getPaymentsByDay(selectedDate)
    .then((sqlResults) => {
      res.status(200).json({
        statusCode: 200,
        statusMessage: "success",
        result: sqlResults,
      });
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.getPaymentsByWeek = (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(startDate, endDate);
  paymentsModel
    .getPaymentsByWeek(startDate, endDate)
    .then((sqlResult) => {
      if (!sqlResult) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "error",
          result: "algo salio mal en la consulta",
        });
      }
      res.status(200).json({
        statusCode: 200,
        statusMessage: "success",
        result: sqlResult,
      });
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "Error en el servico del lado del servidor",
        result: error,
      });
    });
};
