const invoiceModel = require("../models/invoices");

exports.getInvoices = (req, res) => {
  invoiceModel
    .getInvoices()
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
          result: "No hay Facturas por mostrar",
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.getInvoice = (req, res) => {
  const { idInvoice } = req.params;
  invoiceModel
    .getInvoice(idInvoice)
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "Factura Inexistente",
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.getInvoicesByRoute = (req, res) => {
  const { idRoute } = req.params;
  invoiceModel
    .getInvoicesByRoute(idRoute)
    .then((results) => {
      res.json({
        statusCode: 200,
        statusMessage: "success",
        result: results,
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

exports.addInvoice = (req, res) => {
  const {
    idClient,
    typePayment,
    status,
    expirationDate,
    discount,
    detailInvoice,
  } = req.body;

  invoiceModel
    .insertInvoiceAndDetailTransaction(
      idClient,
      typePayment,
      status,
      expirationDate,
      discount,
      detailInvoice
    )
    .then((sqlTransactionResult) => {
      if (sqlTransactionResult) {
        res.json({
          statusCode: 200,
          statusMessage: "success",
          executed: sqlTransactionResult,
          result: "Factura y detalles agregados correctamente",
        });
      } else if (!sqlTransactionResult) {
        res.json({
          statusCode: 500,
          statusMessage: "error",
          executed: sqlTransactionResult,
          result: "Error en la transaccion",
        });
      }
    })
    .catch((error) => {
      res.json({
        statusCode: 500,
        statusMessage: "Error al intentar añadir Factura",
        result: error,
      });
    });
};

exports.updateInvoice = (req, res) => {
  const {
    idFactura,
    idCliente,
    idTipoPedido,
    estado,
    fechaEmision,
    fechaVencimiento,
    importe,
    saldo,
    descuento,
    idUsuario,
  } = req.body;

  invoiceModel
    .updateInvoice(
      idFactura,
      idCliente,
      idTipoPedido,
      estado,
      fechaEmision,
      fechaVencimiento,
      importe,
      saldo,
      descuento,
      idUsuario
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else if (response.error) {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "Error al intentar actualizar Factura",
          result: response,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "Error",
        result: error,
      });
    });
};
