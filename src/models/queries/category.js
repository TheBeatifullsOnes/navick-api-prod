module.exports = {
  getCategories: `
    SELECT 
        * 
    FROM 
        categorias`,
  getCategory: `
    SELECT 
        * 
    FROM 
        categorias 
    WHERE 
        id_categoria = $1`,
  updateCategory: `
    UPDATE 
        categorias
    SET 
        nombre=$2
    WHERE 
        id_categoria=$1`,
  insertCategory: `
    INSERT INTO 
        categorias (id_categoria,nombre)
    VALUES($1,$2)`,
  deleteCategory: `
    DELETE FROM 
        categorias 
    WHERE 
        id_categoria=$1`,
};
