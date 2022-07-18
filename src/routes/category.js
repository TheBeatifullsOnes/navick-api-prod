import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";
import {
  getCategories,
  getCategory,
  updateCategory,
  insertCategory,
  deleteCategory,
} from "../controllers/category.js";

const routesCategories = express.Router();

routesCategories.get("/", ensureAuthenticated, getCategories);
routesCategories.get("/:idCategory", ensureAuthenticated, getCategory);
routesCategories.put("/", ensureAuthenticated, updateCategory);
routesCategories.post("/", ensureAuthenticated, insertCategory);
routesCategories.delete("/:idCategory", ensureAuthenticated, deleteCategory);

export default routesCategories;
