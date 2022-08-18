import jwt from "jsonwebtoken";
import moment from "moment";
import { TOKEN_SECRET } from "../config/config.js";

export const createToken = (
  username,
  name,
  id_route,
  id_user,
  id_user_type,
  status
) => {
  const payload = {
    sub: {
      username: username,
      nombre: name,
      idRuta: id_route,
      idUsuario: id_user,
      idUserType: id_user_type,
      status: status,
    },
    iat: Number(moment.unix()),
    exp: moment().add(1440, "minutes").unix(),
  };
  return jwt.sign(payload, TOKEN_SECRET);
};
