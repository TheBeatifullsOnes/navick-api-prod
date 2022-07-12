const jwt = require("jsonwebtoken");
const config = require("../config/config");
const authModel = require("../models/auth");

const logger = require("../utils/logger");

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.headers.token) {
    return res
      .status(403)
      .json({ message: "Petición sin cabecera de autorización" });
  }
  const decodeToken = jwt.decode(req.headers.token);
  const { username } = decodeToken.sub;
  console.log(username);
  authModel.login(username).then((sqlResult) => {
    if (sqlResult.rowCount > 0) {
      jwt.verify(req.headers.token, config.TOKEN_SECRET, (err, payload) => {
        if (err) {
          switch (err.name) {
            case "JsonWebTokenError":
              return res.status(401).json({ message: "Token incorrecto" });
            case "TokenExpiredError":
              return res.status(401).json({ message: "Token caducado" });
            default:
              return res.status(401).json(err);
          }
        }

        req.data = payload.sub;
        next();
      });
    } else {
      return res.status(401).json({ message: "El Usuario no existe" });
    }
  });
};
