const connexion = require("../config/bdConnexion");

module.exports = {
  async getInvoices() {
    const result = await connexion.query(
      `
      SELECT 
        ts.name as id_type_serial,
        i.id_invoice, 
        c.name as name_client,
        i.id_client,
        tp.descripcion as type_payment,
        i.status, 
        i.created_at, 
        i.expiration_date, 
        i.total_amount, 
        i.remaining_payment, 
        i.discount
      FROM 
        public.invoices i
      INNER JOIN
        public.type_serial ts
      ON
        ts.id_type_serial=i.id_type_serial
      INNER JOIN
        public.clients c
      ON 
        i.id_client= c.id_client
      INNER JOIN
        public.tipopedido tp
      ON 
        tp.id_tipopedido = i.type_payment
      WHERE 
        i.total_amount is not null`
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
        i.id_invoice, i.id_type_serial, ts.name as id_type_serial_name, i.id_client, i.type_payment, i.status, i.created_at, i.expiration_date, i.total_amount, i.remaining_payment, i.discount
      FROM
        invoices as i
      INNER JOIN 
        clients as c 
      ON 
        i.id_client=c.id_client
      INNER JOIN 
        type_serial as ts
      ON 
        ts.id_type_serial= i.id_type_serial
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
    fechaVencimiento,
    importe,
    saldo,
    descuento
  ) {
    const existRegister = connexion.query(
      `SELECT * FROM invoices where id_invoice = $1`,
      [idFactura]
    );
    if ((await existRegister).rows.length == 0) {
      return { error: "No existe la Factura que intentas Actualizar" };
    } else {
      const result = await connexion.query(
        `
          UPDATE 
            public.invoices
        	SET 
            id_client=$2, type_payment=$3, status=$4, 
            expiration_date=$5, total_amount=$6, remaining_payment=$7, 
            discount=$8
	        WHERE id_invoice=$1`,
        [
          idFactura,
          idCliente,
          idTipoPedido,
          estado,
          fechaVencimiento,
          importe,
          saldo,
          descuento,
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
            }
            // else {
            //   client.query("COMMIT");
            console.log(
              "client.query() COMMIT row count:",
              result.rowCount,
              result
            );
            // }
          }
        );
        executed = true;
      });
      await client.query("COMMIT");
      client.release(true);
    } catch (error) {
      await client.query("ROLLBACK");
      client.release(true);
      throw error;
    }
    return executed;
  },
  async getInvoicesByCurrentDay(idInvoice) {
    const queryTextGetIvoicesByCurrentDay = `
      SELECT 
        i.* 
      FROM 
        invoices as i
      INNER JOIN
        clients c
      ON 
        i.id_client =c.id_client
      WHERE 
        date_trunc('day', i.created_at)::date = current_date
      AND 
        c.id_route = $1`;
    const result = await connexion.query(queryTextGetIvoicesByCurrentDay, [
      idInvoice,
    ]);
    return result.rows;
  },
  async cancelInvoices(
    idInvoice,
    idUser,
    amount,
    locationGPS,
    comments,
    textTicket,
    printedTicket
  ) {
    console.log(
      idInvoice,
      idUser,
      amount,
      locationGPS,
      comments,
      textTicket,
      printedTicket
    );
    const client = await connexion.connect();

    let executed = false;
    let queryInvoice = null;
    let queryPayment = null;
    try {
      await client.query("BEGIN");
      console.log("Begin transaction");
      // validando que la factura exista
      const queryTextInvoice = `
      SELECT 
        remaining_payment, status
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`;

      const queryTextUpdateInvoiceStatus = `
        UPDATE 
          public.invoices
        SET 
          status=2,
          remaining_payment=$2
        WHERE 
          id_invoice =$1`;

      const queryTextInsertPayment = `
        INSERT INTO
          public.payments
          (
            type_serial, id_invoice, id_user,
            created_at, total_payment, status,
            updated_at, gps_location, comments,
            text_ticket, printed_ticket
          )
        VALUES
          (3,$1, $2, now(), $3, 1, null, $4, $5, $6, $7) returning id_abono, created_at;
      `;

      const result = await client.query(queryTextInvoice, [idInvoice]);
      const { remaining_payment, status } = result.rows[0];
      console.log(
        `Valido que si hay un pago restante existe la factura ${idInvoice} ${remaining_payment}`
      );
      // if remaining_payment the invoice exist
      if (remaining_payment) {
        // if an ammount exist create a payment
        if (status === 2) {
          client.query("ROLLBACK");
          queryInvoice = { error: "la factura ya se encuentra cancelada" }
          queryPayment = { error: "No se inserto nada por que la factura ya esta cancelada" };
        } else {
          // updating the invoice
          await client.query(
            queryTextUpdateInvoiceStatus,
            [idInvoice, remaining_payment - amount],
            (err, result) => {
              if (err) {
                executed = false;
                console.log("\nclient.query():", err);
                // Rollback before executing another transaction
                client.query("ROLLBACK");
              }
              executed = true;
              queryInvoice = {
                command: result.command,
                rowCount: result.rowCount,
              };

              console.log(
                "client.query() COMMIT row count on update:",
                queryInvoice
              );
            }
          );
          if (amount !== 0) {
            console.log(
              `El amount es mayor que 0 y hago una insercion de un abono: ${amount} status:${status}`
            );
            await client.query(
              queryTextInsertPayment,
              [
                idInvoice,
                idUser,
                amount,
                locationGPS,
                comments,
                textTicket,
                printedTicket,
              ],
              (err, result) => {
                if (err) {
                  executed = false;
                  console.log("\nclient.query():", err);
                  // Rollback before executing another transaction
                  client.query("ROLLBACK");
                }
                executed = true;
                queryPayment = {
                  command: result.command,
                  rowCount: result.rowCount,
                };
                console.log(
                  "client.query() COMMIT row count on insert:",
                  result.rowCount
                );
              }
            );
          }
          queryPayment = { message: "no se hizo ningun abono" }
        }
      }
      await client.query("COMMIT");
      await client.release(true);
    } catch (error) {
      await client.query("ROLLBACK");
      await client.release(true);
    }

    return { executed, sqlResult: { queryInvoice, queryPayment } };
  },
};
