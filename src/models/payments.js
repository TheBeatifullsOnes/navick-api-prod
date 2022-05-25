const connexion = require("../config/bdConnexion");

const queryTextGetInvoiceId = `
      SELECT 
        remaining_payment
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`;
const queryTextUpdateInvoiceRP = `
      UPDATE 
        public.invoices
      SET 
        remaining_payment=$2
      WHERE 
        id_invoice =$1
      `;
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
    `;

const queryTextUpdateInvoiceStatus = `
      UPDATE 
        public.invoices
      SET 
        status=0
      WHERE 
        id_invoice =$1`;
const queryStringPaymentsByRoute = `
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
        u.id_route = $1 and i.status = 1`;

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
    const client = await connexion.connect();

    let executed = false;
    let sqlResult = null;
    console.log(client.getMaxListeners())
    try {
      // Transaction start
      await client.query("BEGIN")
      console.log("Begin transaction")
      // Getting remainingPayment from invoice
      console.log(`Getting remainingPayment from InvoiceId: ${idInvoice}`)
      const getRemaningPaymentByInvoiceId = await client.query(
        queryTextGetInvoiceId,
        [idInvoice]
      );
      const { remaining_payment } = getRemaningPaymentByInvoiceId.rows[0]
      if (getRemaningPaymentByInvoiceId.rows[0].remaining_payment) {
        console.log("if exist Remaining Payment: ", remaining_payment)
        if (remaining_payment - amount <= 0) {
          await client.query(queryTextUpdateInvoiceStatus, [idInvoice], (err, result) => {
            if (err) {
              executed = false
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
            }
            console.log("client.query() COMMIT row count on update:", result.rowCount);
          })
        }
        //insert payment row
        await client.query(
          queryTextInsertPayment,
          [
            idInvoice,
            idUser,
            amount,
            locationGPS,
            comments,
          ],
          (err, result) => {
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
            }
            executed = true;
            sqlResult = result.rows[0];
            console.log("client.query() COMMIT row count on insert:", result.rowCount);
          }
        )
        // Update the remaining payment
        await client.query(queryTextUpdateInvoiceRP, [idInvoice, remaining_payment - amount],
          (err, result) => {
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              console.log("Transaction ROLLBACK called");
            }
            executed = true;
            console.log("client.query() COMMIT row count on update:", result.rowCount);
          }
        );
      }
      await client.query("COMMIT")
      await client.release(true)

    } catch (error) {
      await client.query("ROLLBACK")
      await client.release(true)

      // await client.end()
      throw error
    }
    // finally {
    //   await client.release(true)
    // }
    // await client.end()

    return { executed, sqlResult }
  },
  async getPaymentsByRoute(idRoute) {
    const result = await connexion.query(
      queryStringPaymentsByRoute,
      [idRoute]
    );
    return result.rows;
  },
};
