const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");

module.exports = {
  async insertaRuta(description) {
    const existRegister = connexion.query(
      `
      SELECT 1 
      FROM
        public.routes
      WHERE
        description=$1
      ORDER BY id_route desc
    `,
      [description]
    );
    if ((await existRegister).rows.length > 0) {
      return { error: "Ya existe una ruta con ese nombre" };
    } else {
      let resultados = await connexion.query(
        `
      INSERT
      INTO 
        public.routes(description, status, created_at, updated_at)
	    VALUES ($1, 1, now(), null)`,
        [description]
      );
      return resultados;
    }
  },
  async listaRutas() {
    const resultados = await connexion.query(`
          SELECT r.id_route, r.description, r.status, r.created_at, r.updated_at, count(id_client) as clientsCount 
            FROM routes as r
          LEFT JOIN clients as c on c.id_route=r.id_route
          GROUP BY r.id_route;`);
    return resultados.rows;
  },
  async actualizaRuta(idRoute, description, status) {
    const existRegister = connexion.query(
      `
      SELECT 1 
      FROM
        public.routes
      WHERE
        description=$1
    `,
      [description]
    );
    if ((await existRegister).rows.length > 0) {
      return { error: "Ya existe una ruta con ese nombre" };
    } else {
      let resultados = await connexion.query(
        `
      UPDATE 
        public.routes
      SET  
        description=$2, status=$3, updated_at=now()
      WHERE id_route = $1`,
        [idRoute, description, status]
      );
      return resultados;
    }
  },
  async eliminaRuta(idRoute) {
    let resultado = await connexion.query(
      `
    DELETE
    FROM 
      public.routes
	  WHERE 
      id_route = $1`,
      [idRoute]
    );
    return resultado;
  },
};
