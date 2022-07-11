const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");
const qrys = require("./queries/auth");

module.exports = {
  async login(username) {
    const resultado = await connexion.query(qrys.login, [username]);
    return resultado;
  },
};
