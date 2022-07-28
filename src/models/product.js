import connexion from "../config/bdConnexion.js";
import { queries } from "./queries/products.js";
// import logger from "../utils/logger.js";
export const getProducts = async () => {
  const result = await connexion.query(queries.getProducts);
  return result.rows;
};
export const getProduct = async (idProduct) => {
  const result = await connexion.query(queries.getProductById, [idProduct]);
  return result.rows;
};
export const insertProduct = async (
  idProduct,
  description,
  idCategory,
  purchasePrice,
  catalogueDate,
  movementDate,
  modificationDate,
  idUserModification,
  status
) => {
  const result = await connexion.query(queries.insertProducts, [
    idProduct,
    description,
    idCategory,
    purchasePrice,
    catalogueDate,
    movementDate,
    modificationDate,
    idUserModification,
    status,
  ]);
  return result;
};
export const updateProduct = async (
  idProduct,
  description,
  idCategory,
  purchasePrice,
  catalogueDate,
  movementDate,
  modificationDate,
  idUserModification,
  status
) => {
  const result = await connexion.query(queries.updateProduct, [
    idProduct,
    description,
    idCategory,
    purchasePrice,
    catalogueDate,
    movementDate,
    modificationDate,
    idUserModification,
    status,
  ]);
  return result;
};
export const deleteProduct = async (idProduct) => {
  const result = await connexion.query(queries.deleteProduct, [idProduct]);
  return result;
};
