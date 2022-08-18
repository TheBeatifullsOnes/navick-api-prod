import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";
import {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

const routesProduct = Router();

routesProduct.get("/", ensureAuthenticated, getProducts);
routesProduct.get("/:idProduct", ensureAuthenticated, getProduct);
routesProduct.post("/", ensureAuthenticated, insertProduct);
routesProduct.put("/", ensureAuthenticated, updateProduct);
routesProduct.delete("/:idProduct", ensureAuthenticated, deleteProduct);

export default routesProduct;
