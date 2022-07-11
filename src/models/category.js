const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");
const qrys = require("./queries/category");

module.exports = {
  async getCategories() {
    const result = await connexion.query(qrys.getCategories);
    return result.rows;
  },
  async getCategory(idCategory) {
    const result = await connexion.query(qrys.getCategory, [idCategory]);
    return result.rows;
  },
  async updateCategory(idCategory, name) {
    let result = connexion.query(qrys.updateCategory, [idCategory, name]);
    return result;
  },
  async insertCategory(idCategory, name) {
    let result = connexion.query(qrys.insertCategory, [idCategory, name]);
    return result;
  },
  async deleteCategory(idCategory) {
    let result = connexion.query(qrys.deleteCategory, [idCategory]);
    return result;
  },
};
