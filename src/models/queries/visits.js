export const q_getVisits = `
    SELECT 
        id_visit, 
        id_client, 
        id_user, 
        id_invoice,
        comments, 
        text_ticket, 
        printed_ticket,
        gps_location, 
        created_at at time zone 'UTC' as created_at
    FROM 
        public.visits
    ORDER BY 
        id_visit 
    DESC;
    `;
export const q_insertVisits = `
    INSERT INTO 
    public.visits(
        id_client, 
        id_user,
        id_invoice,
        comments, 
        text_ticket,
        gps_location, 
        created_at)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7);`;

export const q_updateVisits = `
    UPDATE 
        public.visits
    SET 
        comments=$1, text_ticket=$2, printed_ticket=$3
    WHERE 
        id_visit=$4;
    `;
export const q_deleteVisits = `
    DELETE 
    FROM 
        public.visits
    WHERE 
        id_visit = $1;`;
