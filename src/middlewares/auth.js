const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.ensureAuthenticated = (req, res, next) => {
  if (!req.headers.token) {
    return res
      .status(403)
      .json({ message: "Petición sin cabecera de autorización" });
  }
  //   const token = req.headers.token.split("")[1];
  jwt.verify(req.headers.token, config.TOKEN_SECRET, (err, payload) => {
    if (err) {
      switch (err.name) {
        case "JsonWebTokenError":
          return res.status(401).json({ message: "Signatura incorrecta" });
        case "TokenExpiredError":
          return res.status(401).json({ message: "Token caducado" });
        default:
          return res.status(401).json(err);
      }
    }
    req.data = payload.sub;
    next();
  });
};