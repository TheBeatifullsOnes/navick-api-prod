const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");
const qrys = require("./queries/detailsInvoices");

module.exports = {
  async getdetailsInvoicesById(idFactura) {
    const result = connexion.query(qrys.getDetailsInvoicesById, [idFactura]);
    return (await result).rows;
  },
  async insertInvoiceDetails(
    idInvoice,
    line,
    idArticle,
    quantity,
    price,
    idWarehouse
  ) {
    const result = connexion.query(qrys.insertDetailsInvoices, [
      idInvoice,
      line,
      idArticle,
      quantity,
      price,
      idWarehouse,
    ]);
    return await result;
  },
};
