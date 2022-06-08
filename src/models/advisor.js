const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");

module.exports = {
  async getAdvisors() {
    const results = connexion.query(`
      SELECT 
        id_asesor, nombre, id_ruta, estado, fecha_modifica, id_usuario_modifica, id_usuario
	    FROM 
        public.asesores;
    `);
    return (await results).rows;
  },
  async getAdvisorById(idAdvisor) {
    const results = connexion.query(
      `
      SELECT 
        id_asesor, nombre, id_ruta, estado, fecha_modifica, id_usuario_modifica, id_usuario
	    FROM 
        public.asesores
      WHERE
        id_asesor = $1
    `,
      [idAdvisor]
    );
    return (await results).rows;
  },
  async insertAdvisor(
    idAdvisor,
    name,
    idRoute,
    status,
    dateEdited,
    idUserEdit,
    idUser
  ) {
    const existRegister = connexion.query(
      `
      SELECT 1 
      FROM
        public.asesores
      WHERE
        id_asesor=$1
    `,
      [idAdvisor]
    );
    if ((await existRegister).rows.length > 0) {
      return { error: "este registro ya existe intenta con otro valor" };
    } else {
      const result = connexion.query(
        `
      INSERT INTO 
        public.asesores(
        	id_asesor, nombre, id_ruta, estado, fecha_modifica, id_usuario_modifica, id_usuario)
	    VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [idAdvisor, name, idRoute, status, dateEdited, idUserEdit, idUser]
      );
      return result;
    }
  },
  async updateAdvisor(
    idAdvisor,
    name,
    idRoute,
    status,
    dateEdited,
    idUserEdit,
    idUser
  ) {
    const result = connexion.query(
      `
      UPDATE 
        public.asesores
	    SET 
         nombre=$2, id_ruta=$3, estado=$4, fecha_modifica=$5, id_usuario_modifica=$6, id_usuario=$7
	    WHERE id_asesor=$1`,
      [idAdvisor, name, idRoute, status, dateEdited, idUserEdit, idUser]
    );
    return result;
  },
  async deleteAdvisor(idAdvisor) {
    const result = connexion.query(
      `
      DELETE 
      FROM 
        public.asesores
      WHERE 
        id_asesor = $1`,
      [idAdvisor]
    );
    return result;
  },
};
