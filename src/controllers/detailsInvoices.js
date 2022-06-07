const detailsInvoicesModel = require("../models/detailsInvoices");
const logger = require("../utils/logger");

exports.getInvoicesDetailsById = (req, res) => {
  const { idFactura } = req.body;
  detailsInvoicesModel
    .getdetailsInvoicesById(idFactura)
    .then((response) => {
      if (response.length > 0) {
        const totalFactura = response
          .map((totalItem) => totalItem.precio)
          .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0);

        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          detalleFactura: response,
          total: totalFactura,
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: `no hay detalles de la factura ${idFactura} por mostrar`,
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
