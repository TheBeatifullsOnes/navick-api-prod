const { Pool } = require("pg");
const VARIABLES = require("../config/config");
const logger = require("../utils/logger");

const pool = new Pool({
  user: "navick", //VARIABLES.USER,
  host: VARIABLES.HOST,
  database: VARIABLES.DB_NAME,
  password: VARIABLES.PASSWORD,
  port: VARIABLES.PORT_DB,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

logger.info(`Se establecio la conexion a la base de datos `);

module.exports = pool;
