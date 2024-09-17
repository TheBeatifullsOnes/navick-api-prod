export const getInvoices = `
      SELECT 
        ts.name as id_type_serial,
        i.id_invoice, 
        c.name as name_client,
        i.id_client,
        tp.descripcion as type_payment,
        i.status, 
        i.created_at, 
        i.expiration_date, 
        i.total_amount, 
        i.remaining_payment, 
        i.discount
      FROM 
        public.invoices i
      INNER JOIN
        public.type_serial ts
      ON
        ts.id_type_serial=i.id_type_serial
      INNER JOIN
        public.clients c
      ON 
        i.id_client= c.id_client
      INNER JOIN
        public.tipopedido tp
      ON 
        tp.id_tipopedido = i.type_payment
      WHERE 
        i.total_amount is not null`;

export const getInvoiceByIdinvoice = `
    SELECT 
        id_invoice,  id_client,  type_payment, status, created_at, expiration_date, total_amount, remaining_payment, discount
    FROM 
        public.invoices
    WHERE 
        id_invoice = $1`;

export const insertInvoice = `
      INSERT INTO 
        public.invoices
        (
          id_type_serial, id_client, type_payment, 
          status, created_at, expiration_date, 
          total_amount, remaining_payment, discount
        )
      VALUES 
        (1, $1, $2, $3, $4, $5, $6, $7, $8) returning id_invoice`;

export const getInvoicesByRoute = `
      SELECT *
      FROM public.vt_get_all_pending_invoices
      WHERE
      id_route = $1`;

export const getInvoiceByClientId = `
    SELECT
        *
    FROM
        public.invoices
    WHERE
        id_client = $1`;

export const updateInvoiceByIdinvoice = `
    UPDATE 
        public.invoices
    SET 
        id_client=$2, type_payment=$3, status=$4, 
        expiration_date=$5, total_amount=$6, remaining_payment=$7, 
        discount=$8
    WHERE 
        id_invoice=$1`;

export const getRemainingPaymentByIdinvoice = `
      SELECT 
        remaining_payment 
      FROM 
        invoices 
      WHERE 
        id_invoice = $1
      `;

export const updateRemainingPaymentByIdinvoice = `
      UPDATE 
        public.invoices
	    SET 
        remaining_payment=$2
	    WHERE 
        id_invoice =$1;
      `;

export const insertDetailsInvoices = `
        INSERT INTO 
          public.details_invoices
          (
	          id_invoice, line, id_product,
            quantity, price, id_warehouse
          )
	      VALUES ($1, $2, $3, $4, $5, $6);`;

export const getIvoicesByCurrentDay = `
      SELECT 
        i.* 
      FROM 
        invoices as i
      INNER JOIN
        clients c
      ON 
        i.id_client =c.id_client
      WHERE 
        date_trunc('day', i.created_at)::date = current_date
      AND 
        c.id_route = $1`;

export const getRemainingPaymentToCancel = `
      SELECT 
        remaining_payment, status
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`;

export const updateInvoiceStatus = `
        UPDATE 
          public.invoices
        SET 
          status=3,
          remaining_payment=$2
        WHERE 
          id_invoice =$1`;

export const insertPaymentInCancel = `
        INSERT INTO
          public.payments
          (
            id_payment,
            type_serial, id_invoice, id_user,
            created_at, total_payment, status,
            updated_at, gps_location, comments,
            text_ticket, printed_ticket
          )
        VALUES
          ($9 ,3 , $1, $2, $8, $3, 1, null, $4, $5, $6, $7) returning id_payment, created_at at time zone 'UTC' as created_at;
      `;
export const getPaymentsByPaymentId = `
      SELECT 
          *
      FROM 
          public.payments
      WHERE 
          id_payment =$1
        `;
