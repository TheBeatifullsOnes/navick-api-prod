const { query } = require("express");
const res = require("express/lib/response");
const connexion = require("../config/bdConnexion");

module.exports = {
  async getAbonos() {
    const results = await connexion.query(
      `
      SELECT 
          *
      FROM 
          public.payments
        `
    );
    return results.rows;
  },
  async getPaymentsByInvoice(idInvoice) {
    const results = await connexion.query(
      `
      SELECT 
          *
      FROM 
          public.payments
      WHERE 
          id_invoice =$1
        `,
      [idInvoice]
    );
    return results.rows;
  },
  async addPayment(
    idInvoice,
    idUser,
    date,
    amount,
    state,
    dateUpdate,
    idUserModify,
    locationGPS,
    notes
  ) {
    const result = await connexion.query(
      `
      INSERT INTO 
        public.abonos(
	        id_factura, id_asesor, fecha, 
          monto, estado, fecha_modifica, 
          id_usuario_modifica, ubicacion_gps, observaciones)
	    VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `,
      [
        idInvoice,
        idUser,
        date,
        amount,
        state,
        dateUpdate,
        idUserModify,
        locationGPS,
        notes,
      ]
    );
    return result;
  },
  async addPaymentUpdateRemainingPayment(
    idInvoice,
    idUser,
    amount,
    state,
    locationGPS,
    comments
  ) {
    console.log("inicio de la transaccion");
    let executed = false;
    const client = await connexion.connect();
    let sqlResult = null;
    try {
      console.log("inicio try");

      await client.query("BEGIN");
      //get Remaining Payment if not search result, throw error
      const queryTextGetInvoiceId = `
      SELECT 
        remaining_paymentg 
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`;
      const queryValuesGetInvoiceId = [idInvoice];

      const getRemaningPaymentByInvoiceId = await client.query(
        queryTextGetInvoiceId,
        queryValuesGetInvoiceId
      );
      console.log("tengo algo del remaining paiment");
      console.log(getRemaningPaymentByInvoiceId.rows);
      if (getRemaningPaymentByInvoiceId.rows[0].remaining_paymentg) {
        //update for the remaining_payment
        const queryTextUpdateInvoiceRP = `
          UPDATE 
            public.invoices
          SET 
            remaining_paymentg=$2
          WHERE 
            id_invoice =$1;
          `,
          queryValuesUpdateRP = [
            idInvoice,
            getRemaningPaymentByInvoiceId.rows[0].remaining_paymentg - amount,
          ];
        await client.query(
          queryTextUpdateInvoiceRP,
          queryValuesUpdateRP,
          (err, result) => {
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              console.log("Transaction ROLLBACK called");
            } else {
              executed = true;
              client.query("COMMIT");
              console.log("client.query() COMMIT row count:", result.rowCount);
            }
          }
        );
        // insert the payment
        const queryTextInsertPayment = `
            INSERT INTO
              public.payments
              (
                type_serial, id_invoice, id_user,
                created_at, total_payment, status,
                updated_at, gps_location, comments
              )
            VALUES
              (3,$1, $2, now(), $3, $4, null, $5, $6) returning id_abono, created_at;
          `,
          queryValuesInsertPayment = [
            idInvoice,
            idUser,
            amount,
            state,
            locationGPS,
            comments,
          ];
        await client.query(
          queryTextInsertPayment,
          queryValuesInsertPayment,
          (err, result) => {
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              console.log("Transaction ROLLBACK called");
            } else {
              executed = true;
              sqlResult = result.rows[0];
              client.query("COMMIT");
              console.log("client.query() COMMIT row count:", result.rowCount);
            }
          }
        );
        await client.query("COMMIT");
      } else {
        client.query("ROLLBACK");
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release;
    }
    return { executed, sqlResult };
  },
  async getPaymentsByRoute(idRoute) {
    const result = await connexion.query(
      `
      select 
        p.id_abono, p.created_at, p.total_payment, p.id_invoice
      from 
        payments p
      inner join 
        users u
      on 
        p.id_user=u.id_user
      inner join 
        invoices i
      on 
        i.id_invoice = p.id_invoice
      where
        u.id_route = $1 and i.status = 1`,
      [idRoute]
    );
    return result.rows;
  },
};
