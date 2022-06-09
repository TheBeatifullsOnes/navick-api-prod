const connexion = require("../config/bdConnexion");
const logger = require("../utils/logger");

module.exports = {
  async getVisits() {
    const resultados = await connexion.query(
      `
      SELECT 
        id_visit, 
        id_client, 
        id_user, 
        id_invoice,
        comments, 
        text_ticket, 
        printed_ticket,
        gps_location
	    FROM 
        public.visits
      ORDER BY 
        id_visit 
      DESC;
        `
    );
    logger.warn(`Visits Model getting a list of the data query`);
    return resultados.rows;
  },
  async insertVisits(
    idClient,
    idUser,
    idInvoice,
    comments,
    textTicket,
    gpsLocation
  ) {
    const resultados = await connexion.query(
      `
      INSERT INTO 
        public.visits(
          id_client, 
          id_user,
          id_invoice,
          comments, 
          text_ticket,
          gps_location)
	    VALUES 
        ($1, $2, $3, $4, $5, $6);
        `,
      [idClient, idUser, idInvoice, comments, textTicket, gpsLocation]
    );
    return resultados;
  },
  async updateVisits(comments, textTicket, printedTicket, idVisit) {
    const resultados = await connexion.query(
      `
        UPDATE 
            public.visits
        SET 
            comments=$1, text_ticket=$2, printed_ticket=$3
        WHERE 
            id_visit=$4;
        `,
      [comments, textTicket, printedTicket, idVisit]
    );
    return resultados;
  },
  async deleteVisits(idVisit) {
    const resultados = await connexion.query(
      `
      DELETE 
      FROM 
        public.visits
	    WHERE 
        id_visit = $1;
        `,
      [idVisit]
    );
    return resultados;
  },
};
