const authModel = require("../models/auth");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  authModel.login(username).then((resultado) => {
    if (resultado.rowCount > 0) {
      const validPassword = bcrypt.compare(
        password,
        resultado.rows[0].password
      );
      const { username, name, id_route, id_user } = resultado.rows[0];
      validPassword.then((value) => {
        if (value) {
          res.status(200).json({
            statusCode: 200,
            statusMessage: "success",
            result: {
              username: username,
              nombre: name,
              idRuta: id_route,
              idUsuario: id_user,
            },
          });
        } else {
          res.status(500).json({
            statusCode: 500,
            statusMessag: "error",
            result: "wrong password",
          });
        }
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        statusMessage: "error",
        result: "user invalid",
      });
    }
  });
};
