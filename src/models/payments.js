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
  async addPaymentUpdateRemainingPayment(
    idInvoice,
    idUser,
    amount,
    state,
    locationGPS,
    comments,
    timestamp
  ) {
    let sqlResult = null;
    let executed = false;
    let invoiceZero = false;
    const client = await connexion.connect();
    try {
      await client.query("BEGIN");
      //get Remaining Payment if not search result, throw error
      const queryTextGetInvoiceId = `
      SELECT 
        remaining_payment 
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`;
      const queryValuesGetInvoiceId = [idInvoice];

      const getRemaningPaymentByInvoiceId = await client.query(
        queryTextGetInvoiceId,
        queryValuesGetInvoiceId
      );
      //validar que la factura exista antes de hacer el insert
      if (getRemaningPaymentByInvoiceId.rows[0].remaining_payment) {
        const finalTR =
          getRemaningPaymentByInvoiceId.rows[0].remaining_payment - amount;
        if (finalTR === 0) {
          // actualizar e status de la factura cuando este sea igual a 0 el pago restanteheroku loginheroku login
          const queryUpdataStatusInvoice = `
          UPDATE 
            public.invoices
          SET 
            status = 0
          WHERE 
            id_invoice =$1;
          `;
          await client.query(
            queryUpdataStatusInvoice,
            [idInvoice],
            (err, result) => {
              if (err) {
                client.query("ROLLBACK");
              } else {
                invoiceZero = true;
                client.query("COMMIT");
              }
            }
          );
        }
        //update for the remaining_payment
        const queryTextUpdateInvoiceRP = `
          UPDATE 
            public.invoices
          SET 
            remaining_payment=$2
          WHERE 
            id_invoice =$1;
          `,
          queryValuesUpdateRP = [idInvoice, finalTR];
        await client.query(
          queryTextUpdateInvoiceRP,
          queryValuesUpdateRP,
          (err, result) => {
            if (err) {
              executed = false;
              // console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              // console.log("Transaction ROLLBACK called");
            } else {
              executed = true;
              client.query("COMMIT");
              // console.log("client.query() COMMIT row count:", result.rowCount);
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
              (3,$1, $2, $3, $4, $5, null, $6, $7) returning id_abono, created_at at time zone 'utc';
          `,
          queryValuesInsertPayment = [
            idInvoice,
            idUser,
            timestamp,
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
              // console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              // console.log("Transaction ROLLBACK called");
            } else {
              sqlResult = result.rows[0];
              executed = true;
              client.query("COMMIT");
              // console.log("client.query() COMMIT row count:", result.rowCount);
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
    return { executed, sqlResult, invoiceZero };
  },
  async getPaymentsByRoute(idRoute) {
    const result = await connexion.query(
      `
      SELECT 
        p.id_abono, p.created_at at time zone 'utc', p.total_payment, p.id_invoice
      FROM 
        payments p
      INNER JOIN 
        users u
      ON 
        p.id_user=u.id_user
      INNER JOIN  
        invoices i
      ON 
        i.id_invoice = p.id_invoice
      WHERE
        u.id_route = $1 
      AND 
        i.status = 1 
      ORDER BY 
        p.created_at 
      DESC`,
      [idRoute]
    );
    return result.rows;
  },
};
