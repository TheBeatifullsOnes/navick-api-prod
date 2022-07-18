import connexion from "../config/bdConnexion.js";
// import logger from "../utils/logger.js";
import * as qrys from "./queries/category.js";

export const getCategories = async () => {
  const result = await connexion.query(qrys.getCategories);
  return result.rows;
};
export const getCategory = async (idCategory) => {
  const result = await connexion.query(qrys.getCategory, [idCategory]);
  return result.rows;
};
export const updateCategory = async (idCategory, name) => {
  let result = connexion.query(qrys.updateCategory, [idCategory, name]);
  return result;
};
export const insertCategory = async (idCategory, name) => {
  let result = connexion.query(qrys.insertCategory, [idCategory, name]);
  return result;
};
export const deleteCategory = async (idCategory) => {
  let result = connexion.query(qrys.deleteCategory, [idCategory]);
  return result;
};
