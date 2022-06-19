const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");

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
          updated_at, gps_location, comments,
          text_ticket, printed_ticket
        )
      VALUES
        (3,$1, $2, $6, $3, 1, null, $4, $5, $7, $8) returning id_abono, created_at at time zone 'UTC' as created_at;
    `;

const queryTextUpdateInvoiceStatus = `
      UPDATE 
        public.invoices
      SET 
        status=2
      WHERE 
        id_invoice =$1`;
const queryStringPaymentsByRoute = `
      SELECT 
        p.id_abono, p.created_at, p.total_payment, p.id_invoice, p.text_ticket, p.printed_ticket
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
        u.id_route = $1 and i.status = 1
      OR
        p.printed_ticket = false 
	    ORDER BY 
        p.created_at 
      DESC`;

module.exports = {
  async getAbonos() {
    const results = await connexion.query(
      `
      SELECT 
        *
      FROM 
        public.payments 
      ORDER BY 
        id_abono`
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
    comments,
    timestamp,
    textTicket,
    printedTicket
  ) {
    const client = await connexion.connect();
    let executed = false;
    let sqlResult = null;
    try {
      // Transaction start
      await client.query("BEGIN");
      logger.info("Begin transaction");
      // Getting remainingPayment FROM invoice
      logger.info(`Getting remainingPayment FROM InvoiceId: ${idInvoice}`);
      const getRemaningPaymentByInvoiceId = await client.query(
        queryTextGetInvoiceId,
        [idInvoice]
      );
      const { remaining_payment } = getRemaningPaymentByInvoiceId.rows[0];
      if (remaining_payment) {
        logger.info("if exist Remaining Payment: ", remaining_payment);
        if (remaining_payment - amount === 0) {
          await client.query(
            queryTextUpdateInvoiceStatus,
            [idInvoice],
            (err, result) => {
              if (err) {
                executed = false;
                logger.info("\nclient.query():", err);
                // Rollback before executing another transaction
                client.query("ROLLBACK");
              }
              logger.info(
                "client.query() COMMIT row count on update:",
                result.rowCount
              );
            }
          );
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
            timestamp,
            textTicket,
            printedTicket,
          ],
          (err, result) => {
            if (err) {
              executed = false;
              logger.info("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
            }
            executed = true;
            sqlResult = result.rows[0];
            logger.info(
              "client.query() COMMIT row count on insert:",
              result.rowCount
            );
          }
        );

        // Update the remaining payment
        await client.query(
          queryTextUpdateInvoiceRP,
          [idInvoice, remaining_payment - amount],
          (err, result) => {
            if (err) {
              executed = false;
              console.log("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              console.log("Transaction ROLLBACK called");
            }
            executed = true;
            console.log(
              "client.query() COMMIT row count on update:",
              result.rowCount
            );
          }
        );
      }
      await client.query("COMMIT");
      await client.release(true);
    } catch (error) {
      await client.query("ROLLBACK");
      await client.release(true);
      throw error;
    }
    return { executed, sqlResult };
  },
  async getPaymentsByRoute(idRoute) {
    const result = await connexion.query(queryStringPaymentsByRoute, [idRoute]);
    return result.rows;
  },
  async updateTicket(idPayment, textTicket, printedTicket) {
    const queryTextUpdatePayment = `
    UPDATE 
      PUBLIC.payments
    SET 
      text_ticket=$2, printed_ticket=$3
    WHERE 
      id_abono=$1`;
    const result = await connexion.query(queryTextUpdatePayment, [
      idPayment,
      textTicket,
      printedTicket,
    ]);
    return {
      command: result.command,
      rowCount: result.rowCount,
    };
  },
  async getPaymentsByDay(selectedDate) {
    let result;
    if (selectedDate === "0") {
      const queryTextGetPaymentsByDay = `
      SELECT 
        p.* , c.name
      FROM 
        payments p
      INNER JOIN
        invoices i
      ON
        p.id_invoice=i.id_invoice
      INNER JOIN
        clients c
      ON 
        i.id_client=c.id_client
      WHERE 
        CAST(p.created_at at time zone 'UTC' AS DATE)  = CAST(now() AS DATE);`;
      result = await connexion.query(queryTextGetPaymentsByDay);
    } else if (selectedDate) {
      const queryTextGetPaymentsByDay = `
      SELECT 
        p.* , c.name as client_name, c.latitude, c.longitude
      FROM 
        payments p
      INNER JOIN
        invoices i
      ON
        p.id_invoice=i.id_invoice
      left JOIN
        clients c
      ON 
        i.id_client=c.id_client
      WHERE 
        CAST(p.created_at at time zone 'UTC' AS DATE)  = CAST($1 AS DATE);`;
      result = await connexion.query(queryTextGetPaymentsByDay, [selectedDate]);
    }

    return result.rows;
  },
  async getPaymentsByWeek(startDate, endDate) {
    const queryString = `
    SELECT
      u.name, u.id_route, sum(total_payment), count (total_payment)
    FROM
      public.payments p
    inner join
      public.users u
    ON
      p.id_user= u.id_user
    WHERE
      p.created_at >= $1
    AND 
      p.created_at < $2
    group by u.id_route, u.name;`;
    const result = await connexion.query(queryString, [startDate, endDate]);
    return result.rows;
  },
};
