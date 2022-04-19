const connexion = require("../config/bdConnexion");

module.exports = {
  async insertaRuta(description) {
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
      INSERT
      INTO 
        public.routes(description, state, created_at, updated_at)
	    VALUES ($1, 1, now(), null)`,
        [description]
      );
      return resultados;
    }
  },
  async listaRutas() {
    const resultados = await connexion.query("select * from routes");
    return resultados.rows;
  },
  async actualizaRuta(idRoute, description, state) {
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
      description=$2, state=$3, updated_at=now()
	  WHERE id_route = $1`,
        [idRoute, description, state]
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
