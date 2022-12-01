import createError from "http-errors";
import express from "express";

import cookieParser from "cookie-parser";
// const logger = require("morgan");
import cors from "cors";
import time from "express-timestamp";
import httpLogger from "./src/middlewares/httpLogger.js";

import routesUser from "./src/routes/users.js";
import routesClients from "./src/routes/clients.js";
import routesAuth from "./src/routes/auth.js";
import routesRoutes from "./src/routes/routes.js";
import routesProduct from "./src/routes/product.js";
import routesCategories from "./src/routes/category.js";
import routesInvoices from "./src/routes/invoices.js";
import routesPayments from "./src/routes/payments.js";
import routesVisits from "./src/routes/visits.js";

const app = express();

// app.set("views", path.join(__dirname, "src/views"));
// app.set("view engine", "jade");

app.use(cors());
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(time.init);

// API Routes
app.use("/api/v1/rutas", routesRoutes);
app.use("/api/v1/clientes", routesClients);
app.use("/api/v1/usuarios", routesUser);
app.use("/api/v1/invoices", routesInvoices);
app.use("/api/v1/products", routesProduct);
app.use("/api/v1/categories", routesCategories);
app.use("/api/v1/payments", routesPayments);
app.use("/api/v1/visits", routesVisits);

// Auth Routes
app.use("/", routesAuth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(500).json({ error: "err" });
});

export default app;
