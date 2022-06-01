const dotenv = require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "8000",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "password",
  DB_NAME: process.env.DB_NAME || "Navick_Dev",
  HOST: process.env.HOST || "74.208.212.240",
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  PORT_DB: process.env.PORT_DB,
};
