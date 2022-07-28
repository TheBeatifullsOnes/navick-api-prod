import conn from "pg";
import { USER_DB, HOST, DB_NAME, PASSWORD, PORT_DB } from "../config/config.js";
import logger from "../utils/logger.js";

const connexion = new conn.Pool({
  user: USER_DB,
  host: HOST,
  database: DB_NAME,
  password: PASSWORD,
  port: PORT_DB,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

logger.info(`Se establecio la conexion a la base de datos `);

export default connexion;
