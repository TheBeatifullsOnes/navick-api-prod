import * as invoiceModel from "../models/invoices.js";
import logger from "../utils/logger.js";

export const getInvoices = (req, res) => {
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

export const getInvoice = (req, res) => {
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

export const getInvoicesByRoute = (req, res) => {
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

export const addInvoice = (req, res) => {
  const {
    idClient,
    typePayment,
    status,
    expirationDate,
    discount,
    detailInvoice,
  } = req.body;
  const moment = req.timestamp;
  const timestamp = moment
    .tz("America/Mexico_City")
    .format("YYYY-MM-DD HH:mm:ss");
  invoiceModel
    .insertInvoiceAndDetailTransaction(
      idClient,
      typePayment,
      status,
      expirationDate,
      discount,
      detailInvoice,
      timestamp
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

export const updateInvoice = (req, res) => {
  const {
    idFactura,
    idCliente,
    idTipoPedido,
    estado,
    fechaVencimiento,
    importe,
    saldo,
    descuento,
  } = req.body;

  invoiceModel
    .updateInvoice(
      idFactura,
      idCliente,
      idTipoPedido,
      estado,
      fechaVencimiento,
      importe,
      saldo,
      descuento
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

export const getInvoicesByCurrentDay = (req, res) => {
  const { idRoute } = req.params;
  invoiceModel
    .getInvoicesByCurrentDay(idRoute)
    .then((sqlResult) => {
      if (!sqlResult) {
        res.status(500).json({
          statusCode: 500,
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

export const cancelInvoices = async (req, res) => {
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
  invoiceModel
    .cancelInvoices(
      idInvoice,
      idUser,
      amount,
      locationGPS,
      comments,
      textTicket,
      printedTicket,
      timestamp
    )
    .then((sqlResult) => {
      if (!sqlResult) {
        res.status(500).json({
          statusCode: 500,
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
