const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");
const qrys = require("./queries/payments");

module.exports = {
  async getPayments() {
    const results = await connexion.query(qrys.getPayments);
    return results.rows;
  },
  async getPaymentsByInvoice(idInvoice) {
    const results = await connexion.query(qrys.getPaymentsByInvoiceId, [
      idInvoice,
    ]);
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
        qrys.queryTextGetInvoiceId,
        [idInvoice]
      );
      const { remaining_payment } = getRemaningPaymentByInvoiceId.rows[0];
      if (remaining_payment) {
        logger.info("if exist Remaining Payment: ", remaining_payment);
        if (remaining_payment - amount === 0) {
          await client.query(
            qrys.queryTextUpdateInvoiceStatus,
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
          qrys.queryTextInsertPayment,
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
          qrys.queryTextUpdateInvoiceRP,
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
    const result = await connexion.query(qrys.queryStringPaymentsByRoute, [
      idRoute,
    ]);
    return result.rows;
  },
  async updateTicket(idPayment, textTicket, printedTicket) {
    const result = await connexion.query(qrys.queryTextUpdatePayment, [
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
      result = await connexion.query(qrys.queryTextGetPaymentsByDay);
    } else if (selectedDate) {
      result = await connexion.query(qrys.queryTextGetPaymentsByDay2, [
        selectedDate,
      ]);
    }

    return result.rows;
  },
  async getPaymentsByWeek(startDate, endDate) {
    const result = await connexion.query(qrys.fnGetPaymentsByWeek, [
      startDate,
      endDate,
    ]);
    return result.rows;
  },
};
