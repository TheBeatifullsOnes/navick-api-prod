const paymentsModel = require("../models/payments");

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
        reult: error,
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
        reult: error,
      });
    });
};

exports.addPayment = async (req, res) => {
  const { idInvoice, idUser, amount, state, locationGPS, comments } = req.body;
  paymentsModel
    .addPaymentUpdateRemainingPayment(
      idInvoice,
      idUser,
      amount,
      state,
      locationGPS,
      comments
    )
    .then((sqlTransaction) => {
      if (sqlTransaction) {
        res.json({
          statusCode: 200,
          statusMessage: "success",
          executed: sqlTransaction,
          result: "Abono agregado correctamente",
        });
      } else if (!sqlTransaction) {
        res.json({
          statusCode: 500,
          statusMessage: "error",
          executed: sqlTransaction,
          result: "Error al agregar abono",
        });
      }
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "error",
        reult: error,
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
        reult: error,
      });
    });
};
