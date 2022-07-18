import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";
import {
  listaRutas,
  insertaRuta,
  actualizaRuta,
  eliminaRuta,
} from "../controllers/routes.js";

const routesRoutes = express.Router();

routesRoutes.get("/", ensureAuthenticated, listaRutas);
routesRoutes.post("/", ensureAuthenticated, insertaRuta);
routesRoutes.put("/", ensureAuthenticated, actualizaRuta);
routesRoutes.delete("/:idRoute", ensureAuthenticated, eliminaRuta);

export default routesRoutes;
