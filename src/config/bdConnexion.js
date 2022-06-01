const { Pool } = require("pg");
const VARIABLES = require("../config/config");
const pool = new Pool({
  user: VARIABLES.USER,
  host: VARIABLES.HOST,
  database: VARIABLES.DB_NAME,
  password: VARIABLES.PASSWORD,
  port: VARIABLES.PORT_DB,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
