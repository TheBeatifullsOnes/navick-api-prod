const connexion = require("../config/bdConnexion");

module.exports = {
  async getProducts() {
    const result = await connexion.query(`SELECT * FROM articulos`);
    return result.rows;
  },
  async getProduct(idProduct) {
    const result = await connexion.query(
        `SELECT * FROM 
            articulos 
        WHERE 
            id_articulo = $1`,
        [idProduct]
    );
    return result.rows;
  },
  async insertProduct(
    idProduct,
    description,
    idCategory,
    purchasePrice,
    catalogueDate,
    movementDate,
    modificationDate,
    idUserModification,
    status
  ) {
    const result = await connexion.query(
      `INSERT INTO 
        articulos(
                id_articulo, descripcion, id_categoria, 
                precio_compra, fecha_catalogo, fecha_movimiento, 
                fecha_modifica, id_usuario_modifica, estatus
                )
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      [
        idProduct,
        description,
        idCategory,
        purchasePrice,
        catalogueDate,
        movementDate,
        modificationDate,
        idUserModification,
        status,
      ]
    );
    return result;
  },
  async updateProduct(
    idProduct,
    description,
    idCategory,
    purchasePrice,
    catalogueDate,
    movementDate,
    modificationDate,
    idUserModification,
    status
  ) {
    const result = await connexion.query(
        `UPDATE 
            articulos
        SET  descripcion=$2, id_categoria=$3, 
                precio_compra=$4, fecha_catalogo=$5, fecha_movimiento=$6, 
                fecha_modifica=$7, id_usuario_modifica=$8, estatus=$9
        WHERE id_articulo=$1;`,
      [
        idProduct,
        description,
        idCategory,
        purchasePrice,
        catalogueDate,
        movementDate,
        modificationDate,
        idUserModification,
        status,
      ]
    );
    return result;
  },
  async deleteProduct(idProduct) {
    const result = await connexion.query(
        `DELETE FROM 
            articulos
        WHERE
            id_articulo=$1;`,
      [idProduct]
    );
    return result;
  },
};
