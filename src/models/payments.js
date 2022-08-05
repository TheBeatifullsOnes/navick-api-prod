import connexion from "../config/bdConnexion.js";
import logger from "../utils/logger.js";
import * as qrys from "./queries/payments.js";

export const getPayments = async () => {
  const results = await connexion.query(qrys.getPayments);
  return results.rows;
};
export const getPaymentsByInvoice = async (idInvoice) => {
  const results = await connexion.query(qrys.getPaymentsByInvoiceId, [
    idInvoice,
  ]);
  return results.rows;
};
export const addPaymentUpdateRemainingPayment = async (
  idInvoice,
  idUser,
  amount,
  locationGPS,
  comments,
  timestamp,
  textTicket,
  printedTicket
) => {
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
};
export const getPaymentsByRoute = async (idRoute) => {
  const result = await connexion.query(qrys.queryStringPaymentsByRoute, [
    idRoute,
  ]);
  return result.rows;
};
export const updateTicket = async (idPayment, textTicket, printedTicket) => {
  console.log(isNaN(idPayment));
  if (!isNaN(idPayment)) {
    const result = await connexion.query(qrys.queryTextUpdatePayment, [
      idPayment,
      textTicket,
      printedTicket,
    ]);
    return {
      command: result.command,
      rowCount: result.rowCount,
    };
  }
};
export const getPaymentsByDay = async (selectedDate) => {
  let result;
  if (selectedDate === "0") {
    result = await connexion.query(qrys.queryTextGetPaymentsByDay);
  } else if (selectedDate) {
    result = await connexion.query(qrys.queryTextGetPaymentsByDay2, [
      selectedDate,
    ]);
  }

  return result.rows;
};
export const getPaymentsByWeek = async (startDate, endDate) => {
  const result = await connexion.query(qrys.fnGetPaymentsByWeek, [
    startDate,
    endDate,
  ]);
  return result.rows;
};
