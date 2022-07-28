import * as clientModel from "../models/clients.js";
import { getInvoiceByClientId } from "../models/invoices.js"; //*as invoicesModel
import { getdetailsInvoicesById } from "../models/detailsInvoices.js";
import logger from "../utils/logger.js";

export const obtenerClientes = (req, res) => {
  clientModel
    .getClients()
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

export const getAuditReportByRoute = (req, res) => {
  const { idRoute } = req.params;
  clientModel
    .getAuditReportsByRoute(idRoute)
    .then((response) => {
      if (response.length > 0) {
        res.status(200).json({
          statusCode: 200,
          statusMessage: "success",
          result: response,
        });
      } else {
        res.status(500).json({
          statusCode: 200,
          statusMessage: "error",
          result: "no hay datos en esta ruta",
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

export const getOnlyClientsByRoute = (req, res) => {
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

export const obtenerCliente = (req, res) => {
  const { idCliente } = req.params;
  clientModel
    .getClient(idCliente)
    .then((response) => {
      const invoiceByClient = getInvoiceByClientId(idCliente).then(
        (sqlResults) => {
          return sqlResults;
        }
      );

      invoiceByClient.then((results) => {
        const arrayInvoiceByClient = results.map((elem) => {
          const sqlDetailInvoice = getdetailsInvoicesById(elem.id_invoice).then(
            (sqlResults) => {
              return { ...elem, detalle: sqlResults };
            }
          );
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
export const getClientsByRoute = (req, res) => {
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
            const invoiceByClient = getInvoiceByClientId(ele.id_client).then(
              (sqlResults) => {
                return sqlResults;
              }
            );
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

export const insertaCliente = (req, res) => {
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
      if (response.executed) {
        res.status(201).json({
          statusCode: 201,
          statusMessage: "success",
          result: "cliente insertado correctamente",
        });
      } else {
        res.status(404).json({
          statusCode: 404,
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

export const actualizaCliente = (req, res) => {
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

export const updateClientStatus = (req, res) => {
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

export const getClientCreditInformation = (req, res) => {
  clientModel
    .getClientRemainingPayment()
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

export const deleteClient = (req, res) => {
  const { idClient } = req.params;
  logger.info(`controller: getting the id_client: ${idClient} from params`);
  clientModel
    .deleteClient(idClient)
    .then((sqlResponse) => {
      logger.info(
        `controller: response from the model : ${sqlResponse.sqlResult.message}`
      );
      if (!sqlResponse) {
        res.status(404).json({
          statusCode: 404,
          statusMessage: "error",
          result: "Not found",
        });
      }
      res.status(200).json({
        statusCode: 200,
        message: sqlResponse.sqlResult.message,
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

export const massiveUpdateRouteClients = (req, res) => {
  const { clients } = req.body;
  clientModel
    .massiveUpdateClientsRoutes(clients)
    .then((sqlResult) => {
      if (!sqlResult) {
        res.json({
          statusCode: 404,
          statusMessage: "error",
          result: "something broken",
        });
      }
      res.status(200).json({
        statusCode: 200,
        statusMessage: "succefull",
        result: sqlResult,
      });
    })
    .catch((err) => {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: err.response,
      });
    });
};
