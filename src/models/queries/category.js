export const getCategories = `
    SELECT 
        * 
    FROM 
        categorias`;
export const getCategory = `
    SELECT 
        * 
    FROM 
        categorias 
    WHERE 
        id_categoria = $1`;
export const updateCategory = `
    UPDATE 
        categorias
    SET 
        nombre=$2
    WHERE 
        id_categoria=$1`;
export const insertCategory = `
    INSERT INTO 
        categorias (id_categoria,nombre)
    VALUES($1,$2)`;
export const deleteCategory = `
    DELETE FROM 
        categorias 
    WHERE 
        id_categoria=$1`;
