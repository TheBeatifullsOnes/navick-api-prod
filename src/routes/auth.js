import express from "express";
import { loginController } from "../controllers/auth.js";

const routesAuth = express.Router();
routesAuth.post("/login", loginController);

export default routesAuth;
