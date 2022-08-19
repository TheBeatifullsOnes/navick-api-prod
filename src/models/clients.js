import connexion from "../config/bdConnexion.js";
import logger from "../utils/logger.js";
import * as qrys from "./queries/clients.js";

// module.exports = {
export const getClients = async () => {
  const resultados = await connexion.query(qrys.getClients);
  return resultados.rows;
};
export const getAuditReportsByRoute = async (idRoute) => {
  const resultados = await connexion.query(qrys.fnAudit, [idRoute]);
  return resultados.rows;
};
export const getClient = async (idCliente) => {
  const resultados = await connexion.query(qrys.getClient, [idCliente]);
  return { usuario: resultados.rows };
};
export const addClient = async (
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
) => {
  const client = await connexion.connect();

  let executed = false;
  let sqlResult = null;

  try {
    await client.query("BEGIN");
    // name to upperCase
    const nameToUppercase = upperCaseAndTrimString(name);
    const existClient = await client.query(
      qrys.searchClientByNameAndZipcode(nameToUppercase),
      [zipCode]
    );

    if (existClient.rowCount === 0) {
      const resultados = await connexion.query(qrys.insertClient, [
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
      ]);
      executed = true;
      sqlResult = { resultados };
    } else {
      executed = false;
      sqlResult = { message: "el usuario ya existe intenta nuevamente" };
    }
    // return resultados;
    await client.query("COMMIT");
    await client.release(true);
  } catch (error) {
    await client.query("ROLLBACK");
    await client.release(true);
  }
  return { executed, sqlResult };
};
export const updateClient = async (
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
) => {
  let resultados = connexion.query(qrys.updateClient, [
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
  ]);
  return resultados;
};
export const updateClientStatus = async (idCliente, status) => {
  let resultado = await connexion.query(qrys.updateClientStatus, [
    idCliente,
    status,
  ]);
  return resultado;
};
export const deleteClient = async (idClient) => {
  const client = await connexion.connect();
  let executed = false;
  let sqlResult = null;
  try {
    await client.query("BEGIN");
    logger.info(
      `model: verificating that the client ${idClient} get pending invoices`
    );
    // verify if the client get invoice active
    const existInvoices = await client.query(qrys.getClientByInvoice, [
      idClient,
    ]);
    if (existInvoices.rowCount <= 0) {
      //procedemos a eliminar el cliente
      await client.query(qrys.deleteClient, [idClient], (err, result) => {
        if (err) {
          executed = false;
          logger.info("\nclient.query():", err);
          // Rollback before executing another transaction
          client.query("ROLLBACK");
          logger.info("Transaction ROLLBACK called");
        }
        if (result.rowCount !== 0) {
          executed = true;
          sqlResult = {
            message: "Usuario eliminado de la base de datos",
          };
        } else {
          executed = false;
          client.query("ROLLBACK");
          logger.info("Transaction ROLLBACK called");
          // Rollback before executing another transaction
          sqlResult = {
            message: "El usuario que intentas eliminar no existe",
          };
        }
      });
    } else {
      sqlResult = {
        message:
          "Este usurio cuentra con facturas por lo cual no se puede eliminar",
      };
    }
    await client.query("COMMIT");
    await client.release(true);
    logger.info(`Transaction executed correctly`);
  } catch (error) {
    await client.query("ROLLBACK");
    await client.release(true);
    throw error;
  }
  return { executed, sqlResult };
};
export const getClientByRoute = async (idRuta) => {
  let resultados = await connexion.query(qrys.getClientByRoute, [idRuta]);
  return resultados.rows;
};
export const getClientRemainingPayment = async () => {
  const resultados = await connexion.query(qrys.getClientsRemainingPayment);
  return resultados.rows;
};
export const massiveUpdateClientsRoutes = async (clients) => {
  let executed = false;
  let sqlResult = null;
  let contador = 0;
  const client = await connexion.connect();
  try {
    // Transaction start
    await client.query("BEGIN");
    clients.forEach(async (cli) => {
      const { idClient, idRoute } = cli;
      const data = await client.query(qrys.queryUpdateClientsRoute, [
        idRoute,
        idClient,
      ]);
      contador += data.rowCount;
      if (contador === clients.length) {
        executed = true;
        sqlResult = {
          message: `you have updated ${contador} registers of clients`,
        };
      } else {
        executed = false;
        sqlResult = {
          message: "something went wrong",
        };
      }
    });
    await client.query("COMMIT");
    await client.release(true);
  } catch (error) {
    await client.query("ROLLBACK");
    await client.release(true);
    throw error;
  }
  return { executed, sqlResult };
};

//pending to move to another file

function upperCaseAndTrimString(str) {
  return str.toUpperCase().replace(" ", "").replace("  ", "").replace(" ", "");
}
