const clientModel = require("../models/clients");
const invoicesModel = require("../models/invoices");
const invoiceDetailsModel = require("../models/detailsInvoices");
const logger = require("../utils/logger");

exports.obtenerClientes = (req, res) => {
  clientModel
    .obtenerClientes()
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
          result: "no hay clientes por mostrar",
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

exports.getOnlyClientsByRoute = (req, res) => {
  const { idRoute } = req.params;
  clientModel
    .getClientByRoute(idRoute)
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "error clients not found",
          result: response,
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

exports.obtenerCliente = (req, res) => {
  const { idCliente } = req.params;
  clientModel
    .getClient(idCliente)
    .then((response) => {
      const invoiceByClient = invoicesModel
        .getInvoiceByClientId(idCliente)
        .then((sqlResults) => {
          return sqlResults;
        });

      invoiceByClient.then((results) => {
        const arrayInvoiceByClient = results.map((elem) => {
          const sqlDetailInvoice = invoiceDetailsModel
            .getdetailsInvoicesById(elem.id_invoice)
            .then((sqlResults) => {
              return { ...elem, detalle: sqlResults };
            });
          return sqlDetailInvoice;
        });
        Promise.all(arrayInvoiceByClient).then((results) => {
          res.json({
            statusCode: 200,
            statusMessage: "success",
            usuario: response.usuario,
            facturas: results,
          });
        });
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
exports.getClientsByRoute = (req, res) => {
  const { idRoute } = req.params;
  const clientsByRoutes = clientModel
    .getClientByRoute(idRoute)
    .then((sqlResults) => {
      return sqlResults;
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
  clientsByRoutes
    .then((results) => {
      const arrayClientsByRouteAndInvoices = results.map((ele) => {
        const { id_client } = ele;
        const getClientById = clientModel
          .getClient(id_client)
          .then((sqlResults) => {
            return sqlResults;
          });

        const sqlClientByInvoice = getClientById.then((usariosResults) => {
          const mapeo = usariosResults.usuario.map((ele) => {
            const invoiceByClient = invoicesModel
              .getInvoiceByClientId(ele.id_client)
              .then((sqlResults) => {
                return sqlResults;
              });
            const sqlInvoiceByClient = invoiceByClient
              .then((results) => {
                return results;
              })
              .catch((error) => {
                res.status(500).json({
                  statusCode: 500,
                  statusMessage: "error",
                  result: error,
                });
              });
            return sqlInvoiceByClient;
          });
          return Promise.all(mapeo).then((results) => {
            return { usuario: usariosResults.usuario, facturas: results };
          });
        });
        return sqlClientByInvoice;
      });
      Promise.all(arrayClientsByRouteAndInvoices).then((results) => {
        res.json({ statusCode: 200, statusMessage: "success", results });
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

exports.insertaCliente = (req, res) => {
  const {
    name,
    idRoute,
    street,
    externalNumber,
    internalNumber,
    neighborhood,
    city,
    state,
    zipCode,
    personalPhoneNumber,
    homePhoneNumber,
    email,
    idPriceList,
    status,
    payDays,
    latitude,
    longitude,
    comments,
  } = req.body;
  clientModel
    .addClient(
      name,
      idRoute,
      street,
      externalNumber,
      internalNumber,
      neighborhood,
      city,
      state,
      zipCode,
      personalPhoneNumber,
      homePhoneNumber,
      email,
      idPriceList,
      status,
      payDays,
      latitude,
      longitude,
      comments
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(201).json({
          statusCode: 201,
          statusMessage: "success",
          result: "cliente insertado correctamente",
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
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: error,
      });
    });
};

exports.actualizaCliente = (req, res) => {
  const {
    idClient,
    name,
    idRoute,
    street,
    externalNumber,
    internalNumber,
    neighborhood,
    city,
    state,
    zipCode,
    personalPhoneNumber,
    homePhoneNumber,
    email,
    idPriceList,
    status,
    payDays,
    latitude,
    longitude,
    comments,
  } = req.body;
  clientModel
    .actualizarCliente(
      idClient,
      name,
      idRoute,
      street,
      externalNumber,
      internalNumber,
      neighborhood,
      city,
      state,
      zipCode,
      personalPhoneNumber,
      homePhoneNumber,
      email,
      idPriceList,
      status,
      payDays,
      latitude,
      longitude,
      comments
    )
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "cliente actualizado correctamente",
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "error al actualizar el cliente",
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

exports.updateClientStatus = (req, res) => {
  const { idCliente, status } = req.body;
  clientModel
    .updateClientStatus(idCliente, status)
    .then((response) => {
      if (response.rowCount > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: "El estado del usuario se actualizo correctamente",
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "Fallo al actualizar el usuario",
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

exports.getClientCreditInformation = (req, res) => {
  clientModel
    .getClientRemainingPayment()
    .then((response) => {
      if (response.length > 0) {
        console.log(response);
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        console.log(response);
        res.status(500).json({
          statusCode: 500,
          statusMessage: "error",
          result: "No hay datos de los clientes",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error fatal",
        result: error,
      });
    });
};
