const connexion = require("../config/bdConnexion");

module.exports = {
  async obtenerClientes() {
    const resultados = await connexion.query("SELECT * FROM clients");
    return resultados.rows;
  },
  async getClient(idCliente) {
    const resultados = await connexion.query(
      `
      SELECT 
        * 
      FROM
        clients 
      WHERE 
        id_client=$1`,
      [idCliente]
    );

    const data = {
      usuario: (await resultados).rows,
    };
    return data;
  },
  async addClient(
    name,
    idRoute,
    street,
    externalNumber,
    internalNumber,
    neighborhood,
    city,
    state,
    zipCode,
    personalPhoneNumber,
    homePhoneNumber,
    email,
    idPriceList,
    status,
    payDays,
    latitude,
    longitude,
    comments
  ) {
    const resultados = await connexion.query(
      `
      INSERT INTO 
        public.clients(
	       name, id_route, street, 
         external_number, internal_number, neighborhood, 
         city, state, zip_code, 
         personal_phonenumber, home_phonenumber, email, 
         id_price_list, created_at, updated_at, 
         status, pay_days, latitude, 
         longitude, comments)
	      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now(), null, $14, $15, $16, $17, $18); 
      `,
      [
        name,
        idRoute,
        street,
        externalNumber,
        internalNumber,
        neighborhood,
        city,
        state,
        zipCode,
        personalPhoneNumber,
        homePhoneNumber,
        email,
        idPriceList,
        status,
        payDays,
        latitude,
        longitude,
        comments,
      ]
    );
    return resultados;
  },
  async actualizarCliente(
    idClient,
    name,
    idRoute,
    street,
    externalNumber,
    internalNumber,
    neighborhood,
    city,
    state,
    zipCode,
    personalPhoneNumber,
    homePhoneNumber,
    email,
    idPriceList,
    status,
    payDays,
    latitude,
    longitude,
    comments
  ) {
    let resultados = connexion.query(
      `
      UPDATE 
        public.clients
	    SET
        name=$2, id_route=$3, street=$4, external_number=$5, 
        internal_number=$6, neighborhood=$7, city=$8, 
        state=$9, zip_code=$10, personal_phonenumber=$11, 
        home_phonenumber=$12, email=$13, id_price_list=$14, 
        updated_at=now(), status=$15, 
        pay_days=$16, latitude=$17, longitude=$18, comments=$19
	    WHERE 
        id_client=$1`,
      [
        idClient,
        name,
        idRoute,
        street,
        externalNumber,
        internalNumber,
        neighborhood,
        city,
        state,
        zipCode,
        personalPhoneNumber,
        homePhoneNumber,
        email,
        idPriceList,
        status,
        payDays,
        latitude,
        longitude,
        comments,
      ]
    );
    return resultados;
  },
  async updateClientStatus(idCliente, status) {
    let resultado = await connexion.query(
      `
      UPDATE
        clients 
      SET 
        status = $2
      WHERE 
      id_client = $1`,
      [idCliente, status]
    );
    return resultado;
  },
  async getClientByRoute(idRuta) {
    let resultados = await connexion.query(
      `
      SELECT 
        distinct, c.*,i.status as status_invoice
      FROM
        users as u
      INNER JOIN 
        clients as c on u.id_route = c.id_route 
      INNER JOIN 
        invoices as i on i.id_client = c.id_client
      WHERE 
        u.id_route=$1
      AND 
        c.status=1
      AND 
        i.status=1;
      `,
      [idRuta]
    );
    return resultados.rows;
  },
};
