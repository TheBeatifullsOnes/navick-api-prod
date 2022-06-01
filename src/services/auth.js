const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const logger = require("../utils/logger");

exports.createToken = (
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
    exp: moment().add(30, "minutes").unix(),
  };
  return jwt.sign(payload, config.TOKEN_SECRET);
};
