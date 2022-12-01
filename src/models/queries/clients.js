// module.exports = {
export const getClient = `
  SELECT 
    * 
  FROM
    clients 
  WHERE 
    id_client=$1`;
export const getClients = `
  SELECT 
    * 
  FROM 
    clients 
  ORDER BY
    id_client 
  DESC`;
export const fnAudit = `
  SELECT 
    * 
  FROM  
    fn_auditoria($1)`;
export const insertClient = `
  INSERT INTO
    public.clients(
      name, id_route, street,
      external_number, internal_number, neighborhood,
      city, state, zip_code,
      personal_phonenumber, home_phonenumber, email,
      id_price_list, created_at, updated_at,
      status, pay_days, latitude,
      longitude, comments
    )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now(), null, $14, $15, $16, $17, $18);`;
export const updateClient = `
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
    id_client=$1`;
export const updateClientStatus = `
  UPDATE
    clients 
  SET 
    status = $2
  WHERE 
  id_client = $1`;
export const getClientByInvoice = `
  SELECT
    i.*
  FROM 
    clients c
  INNER JOIN
    invoices i
  ON 
    c.id_client = i.id_client
  WHERE 
    c.id_client = $1`;
export const deleteClient = `
  DELETE FROM 
    public.clients
  WHERE 
    id_client = $1`;
export const searchClientByNameAndZipcode = (nameToUppercase) => {
  return `
  with clients_name as (
    SELECT 
      c.name ,c.zip_code 
    FROM clients c
  )
  SELECT 
    * 
  FROM
    clients_name 
  WHERE 
    UPPER(REPLACE(name,' ','')) = '${nameToUppercase}'
  AND 
    zip_code=$1`;
};
export const getClientByRoute = `
  SELECT DISTINCT 
    c.*,i.status as status_invoice
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
  `;
export const getClientsRemainingPayment = `
  SELECT 
    * 
  FROM 
    REMAINING_PAYMENT_DETAILS`;
export const queryUpdateClientsRoute = `
  UPDATE 
    public.clients
  SET 
    id_route=$1
  WHERE 
    id_client=$2;`;

export const queryGetBillsWeekly = `
  SELECT 
    *
	FROM 
    public.vt_get_bills_weekly;
`;
