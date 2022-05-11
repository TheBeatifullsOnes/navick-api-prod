const { query } = require("express");
const connexion = require("../config/bdConnexion");

module.exports = {
  async getInvoices() {
    const result = await connexion.query(
      `
      SELECT 
        id_invoice, id_type_serial, id_client,  type_payment, status, created_at, expiration_date, total_amount, remaining_payment, discount
	    FROM 
        public.invoices
      WHERE 
        total_amount is not null`
    );
    return result.rows;
  },
  async getInvoice(idInvoice) {
    const result = await connexion.query(
      `SELECT 
        id_invoice,  id_client,  type_payment, status, created_at, expiration_date, total_amount, remaining_payment, discount
    	FROM 
        public.invoices
      WHERE 
        id_invoice = $1`,
      [idInvoice]
    );
    return result.rows;
  },
  async createInvoice(
    idClient,
    typePayment,
    status,
    expirationDate,
    totalAmount,
    remainingPaymentg,
    discount
  ) {
    const result = await connexion.query(
      `
      INSERT INTO 
        public.invoices
        (
          id_type_serial, id_client, type_payment, 
          status, created_at, expiration_date, 
          total_amount, remaining_payment, discount
        )
      VALUES 
        (1, $1, $2, $3, now(), $4, $5, $6, $7) returning id_invoice`,
      [
        idClient,
        typePayment,
        status,
        expirationDate,
        totalAmount,
        remainingPaymentg,
        discount,
      ]
    );
    return result.rows;
  },

  async getInvoicesByRoute(idRoute) {
    const invoicesByRoute = await connexion.query(
      `
      SELECT 
        i.* 
      FROM
        invoices as i
      INNER JOIN 
        clients as c 
      ON 
        i.id_client=c.id_client
      WHERE
        c.id_route=$1 and i.status = 1
      ORDER BY 
        i.created_at 
      ASC`,
      [idRoute]
    );
    return invoicesByRoute.rows;
  },

  async getInvoiceByClientId(idClient) {
    const facturasByCliente = await connexion.query(
      `
      SELECT
        *
      FROM
        public.invoices
      WHERE
        id_client = $1`,
      [idClient]
    );
    return facturasByCliente.rows;
  },
  async updateInvoice(
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
  ) {
    const existRegister = connexion.query(
      `SELECT * FROM facturas where id_factura = $1`,
      [idFactura]
    );
    if ((await existRegister).rows.length == 0) {
      return { error: "No existe la Factura que intentas Actualizar" };
    } else {
      const result = await connexion.query(
        `
          UPDATE facturas 
          SET 
            id_cliente=$2,id_tipopedido=$3,
            estado=$4,fecha_emision=$5,fecha_vencimiento=$6,
            importe=$7,saldo=$8,descuento=$9,id_usuario=$10
          WHERE id_factura=$1`,
        [
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
        ]
      );
      return result;
    }
  },
  async getSaldoById(idInvoice) {
    const result = await connexion.query(
      `
      SELECT 
        remaining_payment 
      FROM 
        invoices 
      WHERE 
        id_invoice = $1
      `,
      [idInvoice]
    );
    return result.rows;
  },
  async updateSaldoById(idInvoice, saldo) {
    const result = await connexion.query(
      `
      UPDATE 
        public.invoices
	    SET 
        remaining_payment=$2
	    WHERE 
        id_invoice =$1;
      `,
      [idInvoice, saldo]
    );
    return result;
  },
  async insertInvoiceAndDetailTransaction(
    idClient,
    typePayment,
    status,
    expirationDate,
    discount,
    detailInvoice
  ) {
    let executed = false;
    let totalAmount = 0;
    await detailInvoice.forEach((element) => {
      totalAmount += element.price;
    });
    const client = await connexion.connect();
    try {
      await client.query("BEGIN");
      const queryInsertInvoice = `
        INSERT INTO
          public.invoices
          (
            id_type_serial, id_client, type_payment,
            status, created_at, expiration_date,
            total_amount, remaining_payment, discount
          )
        VALUES
          (1, $1, $2, $3, now(), $4, $5, $6, $7) returning id_invoice`;

      const queryInsertDetailsInvoices = `
        INSERT INTO 
          public.details_invoices
          (
	          id_invoice, line, id_product,
            quantity, price, id_warehouse
          )
	      VALUES ($1, $2, $3, $4, $5, $6);`;
      const queryInvoicesValues = [
        idClient,
        typePayment,
        status,
        expirationDate,
        totalAmount,
        totalAmount,
        discount,
      ];

      const insertInvoice = await client.query(
        queryInsertInvoice,
        queryInvoicesValues
      );
      let line = 0;
      detailInvoice.forEach(async (element) => {
        const { idArticle, quantity, price, idWarehouse } = element;
        line += 1;
        const queryValues = [
          insertInvoice.rows[0].id_invoice,
          line,
          idArticle,
          quantity,
          price,
          idWarehouse,
        ];
        await client.query(
          queryInsertDetailsInvoices,
          queryValues,
          (err, result) => {
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              console.log("Transaction ROLLBACK called");
            } else {
              client.query("COMMIT");
              console.log("client.query() COMMIT row count:", result.rowCount);
            }
          }
        );
        executed = true;
      });
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release;
    }
    return executed;
  },
};
