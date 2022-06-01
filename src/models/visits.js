const connexion = require("../config/bdConnexion");

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
        printed_ticket
	    FROM 
        public.visits
      ORDER BY 
        id_visit 
      DESC;
        `
    );
    return resultados.rows;
  },
  async insertVisits(idClient, idUser, idInvoice, comments, textTicket) {
    const resultados = await connexion.query(
      `
      INSERT INTO 
        public.visits(
          id_client, 
          id_user,
          id_invoice,
          comments, 
          text_ticket)
	    VALUES 
        ($1, $2, $3, $4, $5);
        `,
      [idClient, idUser, idInvoice, comments, textTicket]
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
