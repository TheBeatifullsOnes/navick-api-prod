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
    locationGPS,
    comments
  ) {
    let executed = false;
    const client = await connexion.connect();
    let sqlResult = null;
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

      if (getRemaningPaymentByInvoiceId.rows[0].remaining_payment) {
        //update for the remaining_payment
        const queryTextUpdateInvoiceRP = `
          UPDATE 
            public.invoices
          SET 
            remaining_payment=$2
          WHERE 
            id_invoice =$1;
          `,
          queryValuesUpdateRP = [
            idInvoice,
            getRemaningPaymentByInvoiceId.rows[0].remaining_payment - amount,
          ];
        await client.query(
          queryTextUpdateInvoiceRP,
          queryValuesUpdateRP,
          (err, result) => {
            // done();
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              client.end();

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
              (3,$1, $2, now(), $3, 1, null, $4, $5) returning id_abono, created_at;
          `,
          queryValuesInsertPayment = [
            idInvoice,
            idUser,
            amount,
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
            } else {
              executed = true;
              sqlResult = result.rows[0];
              client.query("COMMIT");
            }
          }
        );
        await client.query("COMMIT");
      } else {
        client.query("ROLLBACK");
      }

      await client.query("COMMIT");
      client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
    } catch (e) {
      await client.query("ROLLBACK");
      client
        .end()
        .then(() => console.log("client has disconnected"))
        .catch((err) => console.error("error during disconnection", err.stack));
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
