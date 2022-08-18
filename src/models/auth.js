import connexion from "../config/bdConnexion.js";
import logger from "../utils/logger.js";
import * as qrys from "./queries/auth.js";

export const login = async (username) => {
  logger.info(`Model: username: ${username} attempt to login`);
  const resultado = await connexion.query(qrys.login, [username]);
  return resultado;
};
