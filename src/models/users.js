import connexion from "../config/bdConnexion.js";
// import logger from"../utils/logger.js";

export const obtenerUsuarios = async () => {
  const resultados = await connexion.query(`
      SELECT 
	      u.id_user, u.username, u.name, u.id_user_type, u.password, u.created_at, u.id_route, r.description as id_route_name, u.date_deleted, u.status
      FROM 
	      users u
      INNER JOIN
	      routes r
      ON 
        u.id_route = r.id_route `);
  return resultados.rows;
};
export const obtenerUsuario = async (idUser) => {
  const result = connexion.query(
    `
      SELECT 
        *
      FROM
        public.users
      WHERE
        id_user=$1
    `,
    [idUser]
  );
  return (await result).rows;
};
export const insertarUsuario = async (
  username,
  name,
  idUserType,
  password,
  idRoute
) => {
  const existRegister = connexion.query(
    `
      SELECT 
        1 
      FROM
        public.users
      WHERE
        username=$1
      `,
    [username]
  );
  if ((await existRegister).rows.length > 0) {
    return {
      error: "el username que elejiste ya existe por favor elije otro",
    };
  } else {
    const resultados = await connexion.query(
      `
        INSERT INTO 
          public.users(username, name, id_user_type, password, created_at, id_route, date_deleted, status)
        VALUES 
          ($1, $2, $3, $4, now(), $5, null, 1)
        `,
      [username, name, idUserType, password, idRoute]
    );
    return resultados;
  }
};
export const actualizarUsuario = async (
  username,
  name,
  idUserType,
  hashPassword,
  status,
  idRoute
) => {
  let result;
  if (hashPassword !== "") {
    result = await connexion.query(
      `
      UPDATE 
        public.users
      SET 
        name=$2, id_user_type=$3, password=$4, date_deleted=now(), status=$5, id_route=$6
      WHERE username=$1
      `,
      [username, name, idUserType, hashPassword, status, idRoute]
    );
  } else {
    result = await connexion.query(
      `
      UPDATE 
        public.users
      SET 
        name=$2, id_user_type=$3, date_deleted=now(), status=$4, id_route=$5
      WHERE username=$1
      `,
      [username, name, idUserType, status, idRoute]
    );
  }

  return result;
};
export const eliminarUsuario = async (idUser) => {
  const result = await connexion.query(
    `
      DELETE FROM
        public.users
      WHERE 
        id_user=$1
      `,
    [idUser]
  );
  return result;
};
export const getUsersType = async () => {
  const result = await connexion.query(
    `
      SELECT 
        * 
      FROM 
        tipousuarios
     `
  );
  return result.rows;
};
export const updateUserStatus = async (idUser, status) => {
  const result = await connexion.query(
    `
      UPDATE 
        users 
      SET 
        status=$2, date_deleted=now()
      WHERE 
        id_user=$1`,
    [idUser, status]
  );
  return result;
};
