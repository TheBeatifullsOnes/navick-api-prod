const { Pool } = require("pg");

const pool = new Pool({
  user: "navick",
  host: "74.208.212.240",
  database: "Navick",
  password: "navick2022",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = pool;
