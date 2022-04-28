const connexion = require("../config/bdConnexion");

module.exports = {
  async login(username) {
    const resultado = connexion.query(
      `
        SELECT 
          username, name, id_route, id_user,id_user_type, status, password
        FROM 
          users 
        WHERE 
          username=$1`,
      [username]
    );
    return resultado;
  },
};
