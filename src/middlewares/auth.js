import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";
import { login } from "../models/auth.js";

// import logger from "../utils/logger.js";

export const ensureAuthenticated = (req, res, next) => {
  if (!req.headers.token) {
    return res
      .status(403)
      .json({ message: "Petición sin cabecera de autorización" });
  }

  // agregar el try - catch
  try {
    const decodeToken = jwt.decode(req.headers.token);
    const { username } = decodeToken.sub;
    login(username).then((sqlResult) => {
      if (sqlResult.rowCount > 0) {
        jwt.verify(req.headers.token, TOKEN_SECRET, (err, payload) => {
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
  } catch (error) {
    res.json({ error: error });
  }
};
