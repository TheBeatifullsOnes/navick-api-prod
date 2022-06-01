const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");

module.exports = {
  async login(username) {
    const resultado = connexion.query(
      `
      SELECT 
        u.username, u.name, u.id_route, u.id_user,u.id_user_type, u.status, u.password, r.description
      FROM 
        users u
		  INNER JOIN routes r
		    on u.id_route= r.id_route
      WHERE 
        username=$1`,
      [username]
    );
    return resultado;
  },
};
