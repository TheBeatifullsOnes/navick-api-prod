import connexion from "../config/bdConnexion.js";
// import logger from "../utils/logger.js";
import {
  getDetailsInvoicesById,
  insertDetailsInvoices,
} from "./queries/detailsInvoices.js";

export const getdetailsInvoicesById = async (idFactura) => {
  const result = connexion.query(getDetailsInvoicesById, [idFactura]);
  return (await result).rows;
};
export const insertInvoiceDetails = async (
  idInvoice,
  line,
  idArticle,
  quantity,
  price,
  idWarehouse
) => {
  const result = await connexion.query(insertDetailsInvoices, [
    idInvoice,
    line,
    idArticle,
    quantity,
    price,
    idWarehouse,
  ]);
  return result;
};
