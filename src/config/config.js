import dotevn from "dotenv";

dotevn.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || "8000";
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "password";
export const DB_NAME = process.env.DB_NAME || "Navick_Dev";
export const HOST = process.env.HOST || "74.208.212.240";
export const USER_DB = process.env.USER_DB || "navick";
export const PASSWORD = process.env.PASSWORD || "navick2022";
export const PORT_DB = process.env.PORT_DB || 5432;
