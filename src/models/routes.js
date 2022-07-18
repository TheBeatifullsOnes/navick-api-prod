import connexion from "../config/bdConnexion.js";
import {
  q_getRouteById,
  q_insertRoute,
  q_listRoutesWithClientsCount,
  q_getRouteByDescription,
  q_updateRoute,
  q_deleteRoute,
} from "./queries/routes.js";
// import logger from "../utils/logger";

export const insertaRuta = async (description) => {
  const existRegister = await connexion.query(q_getRouteById, [description]);
  if (existRegister.rows.length > 0) {
    return { error: "Ya existe una ruta con ese nombre" };
  } else {
    let resultados = await connexion.query(q_insertRoute, [description]);
    return resultados;
  }
};
export const listaRutas = async () => {
  const resultados = await connexion.query(q_listRoutesWithClientsCount);
  return resultados.rows;
};
export const actualizaRuta = async (idRoute, description, status) => {
  const existRegister = connexion.query(q_getRouteByDescription, [description]);
  if ((await existRegister).rows.length > 0) {
    return { error: "Ya existe una ruta con ese nombre" };
  } else {
    let resultados = await connexion.query(q_updateRoute, [
      idRoute,
      description,
      status,
    ]);
    return resultados;
  }
};
export const eliminaRuta = async (idRoute) => {
  let resultado = await connexion.query(q_deleteRoute, [idRoute]);
  return resultado;
};
