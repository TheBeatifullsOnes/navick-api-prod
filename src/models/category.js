const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");

module.exports = {
  async getCategories() {
    const result = await connexion.query(`SELECT * FROM categorias`);
    return result.rows;
  },
  async getCategory(idCategory) {
    const result = await connexion.query(
      `SELECT * FROM 
                categorias 
            WHERE 
                id_categoria = $1`,
      [idCategory]
    );
    return result.rows;
  },
  async updateCategory(idCategory, name) {
    let result = connexion.query(
      `UPDATE 
                categorias
            SET 
                nombre=$2
            WHERE 
                id_categoria=$1`,
      [idCategory, name]
    );
    return result;
  },
  async insertCategory(idCategory, name) {
    let result = connexion.query(
      `INSERT INTO 
                categorias (id_categoria,nombre)
            VALUES($1,$2)`,
      [idCategory, name]
    );
    return result;
  },
  async deleteCategory(idCategory) {
    let result = connexion.query(
      `DELETE FROM 
                categorias 
            WHERE 
                id_categoria=$1`,
      [idCategory]
    );
    return result;
  },
};
