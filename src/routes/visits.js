import express from "express";
import { ensureAuthenticated } from "../middlewares/auth.js";
import {
  getVisits,
  insertVisits,
  updateVisits,
  deleteVisits,
} from "../controllers/visits.js";

const routesVisits = express.Router();

routesVisits.get("/", ensureAuthenticated, getVisits);
routesVisits.post("/", ensureAuthenticated, insertVisits);
routesVisits.put("/", ensureAuthenticated, updateVisits);
routesVisits.delete("/:idVisit", ensureAuthenticated, deleteVisits);

export default routesVisits;
