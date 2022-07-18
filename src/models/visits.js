import connexion from "../config/bdConnexion.js";
import logger from "../utils/logger.js";
import {
  q_deleteVisits,
  q_getVisits,
  q_insertVisits,
  q_updateVisits,
} from "./queries/visits.js";

export const getVisits = async () => {
  const resultados = await connexion.query(q_getVisits);
  logger.warn(`Visits Model getting a list of the data query`);
  return resultados.rows;
};

export const insertVisits = async (
  idClient,
  idUser,
  idInvoice,
  comments,
  textTicket,
  gpsLocation,
  timestamp
) => {
  const resultados = await connexion.query(q_insertVisits, [
    idClient,
    idUser,
    idInvoice,
    comments,
    textTicket,
    gpsLocation,
    timestamp,
  ]);
  return resultados;
};
export const updateVisits = async (
  comments,
  textTicket,
  printedTicket,
  idVisit
) => {
  const resultados = await connexion.query(q_updateVisits, [
    comments,
    textTicket,
    printedTicket,
    idVisit,
  ]);
  return resultados;
};
export const deleteVisits = async (idVisit) => {
  const resultados = await connexion.query(q_deleteVisits, [idVisit]);
  return resultados;
};
