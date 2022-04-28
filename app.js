const createError = require("http-errors");
const express = require("express");
var path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
var time = require("express-timestamp");

const usuariosRoutes = require("./src/routes/users");
const rutasRoutes = require("./src/routes/routes");
const clientesRoutes = require("./src/routes/clients");
const authRoutes = require("./src/routes/auth");
const advisorRoutes = require("./src/routes/advisor");
const invoiceRoutes = require("./src/routes/invoices");
const productRoutes = require("./src/routes/product");
const categoryRoutes = require("./src/routes/category");
const paymentsRoutes = require("./src/routes/payments");

const detailsInvoicesRoutes = require("./src/routes/detailsInvoices");

const app = express();

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "jade");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(time.init);

// API Routes
app.use("/api/v1/rutas", rutasRoutes);
app.use("/api/v1/clientes", clientesRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/asesores", advisorRoutes);
app.use("/api/v1/detallesFacturas", detailsInvoicesRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/payments", paymentsRoutes);

app.get("/test", (req, res) => {
  console.log(req);
  res.json("ok");
});

// Auth Routes
app.use("/", authRoutes);

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
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
