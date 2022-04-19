const { Pool } = require("pg");

const pool = new Pool({
  user: "navick",
  host: "74.208.212.240",
  database: "Navick",
  password: "navick2022",
  port: 5432,
});

module.exports = pool;
