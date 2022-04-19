const connexion = require("../config/bdConnexion");

module.exports = {
  async getdetailsInvoicesById(idFactura) {
    const result = connexion.query(
      `
      SELECT 
        id_invoice, line, id_product, quantity, price, id_warehouse
      FROM 
        public.details_invoices 
      WHERE 
        id_invoice=$1
    `,
      [idFactura]
    );
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
    const result = connexion.query(
      `
      INSERT 
      INTO 
        public.details_invoices
        (id_factura, linea, id_articulo, cantidad, precio, id_almacen)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [idInvoice, line, idArticle, quantity, price, idWarehouse]
    );
    return await result;
  },
};
