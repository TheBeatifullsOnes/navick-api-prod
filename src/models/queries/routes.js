export const q_getRouteById = `
      SELECT * 
      FROM
        public.routes
      WHERE
        description=$1
      ORDER BY id_route desc
    `;
export const q_insertRoute = `
      INSERT
      INTO 
        public.routes(description, status, created_at, updated_at)
	    VALUES ($1, 1, now(), null)`;
export const q_listRoutesWithClientsCount = `
          SELECT r.id_route, r.description, r.status, r.created_at, r.updated_at, count(id_client) as clientsCount 
            FROM routes as r
          LEFT JOIN clients as c on c.id_route=r.id_route
          GROUP BY r.id_route;`;
export const q_getRouteByDescription = `
      SELECT 1 
      FROM
        public.routes
      WHERE
        description=$1
    `;

export const q_updateRoute = `
    UPDATE 
      public.routes
	  SET  
      description=$2, status=$3, updated_at=now()
	  WHERE id_route = $1`;
export const q_deleteRoute = `
    DELETE
    FROM 
      public.routes
	  WHERE 
      id_route = $1`;
