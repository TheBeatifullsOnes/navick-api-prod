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
  printedTicket,
  idPayment
) => {
  const client = await connexion.connect();
  let executed = false;
  let sqlResult = null;
  try {
    // Transaction start
    await client.query("BEGIN");
    logger.info("Begin transaction");

    logger.info(`MODEL: validating if the : ${idPayment} exist`);
    const paymentExist = await connexion.query(qrys.getPaymentsByPaymentId, [
      idPayment,
    ]);
    const { rowCount } = paymentExist;
    if (rowCount === 0) {
      // Getting remainingPayment FROM invoice
      logger.info(`Getting remainingPayment FROM InvoiceId: ${idInvoice}`);
      const getRemaningPaymentByInvoiceId = await client.query(
        qrys.queryTextGetInvoiceId,
        [idInvoice]
      );
      const { remaining_payment } = getRemaningPaymentByInvoiceId.rows[0];
      /*
      TODO 
      refactorizar el update para cuando se salda la factura 
      A)
      */
      if (remaining_payment) {
        // agregar validacion para que el saldo sea positivo
        logger.info("if exist Remaining Payment: ", remaining_payment);
        if (remaining_payment - amount === 0) {
          // validar que la resta no sea negativa
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
        //insert payment row b)
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
            idPayment,
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
              logger.info("\nclient.query():", err);
              // Rollback before executing another transaction
              client.query("ROLLBACK");
              logger.info("Transaction ROLLBACK called");
            }
            executed = true;
            logger.info(
              "client.query() COMMIT row count on update:",
              result.rowCount
            );
          }
        );
      }
    } else {
      executed = false;
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
  logger.info(`MODEL: validating if the : ${idPayment} exist`);
  const paymentExist = await connexion.query(qrys.getPaymentsByPaymentId, [
    idPayment,
  ]);
  const { rowCount } = paymentExist;
  if (rowCount > 0) {
    const result = await connexion.query(qrys.queryTextUpdatePayment, [
      idPayment,
      textTicket,
      printedTicket,
    ]);
    logger.info(
      `MODEL: updating printted ticket: ${printedTicket} and text ticket: ${textTicket}`
    );
    return {
      command: result.command,
      rowCount: result.rowCount,
    };
  }
  logger.warn(`MODEL: id Parment: ${idPayment} not found`);
  return {
    errorMsg: "Error el pago no esta registrado en la base de datos",
  };
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
