export const getPayments = `
      SELECT 
        *
      FROM 
        public.payments 
      ORDER BY 
        id_abono`;
export const getPaymentsByInvoiceId = `
      SELECT 
          *
      FROM 
          public.payments
      WHERE 
          id_invoice =$1
        `;
export const queryTextGetInvoiceId = `
      SELECT 
        remaining_payment
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`;
export const queryTextUpdateInvoiceRP = `
      UPDATE 
        public.invoices
      SET 
        remaining_payment=$2
      WHERE 
        id_invoice =$1
      `;
export const queryTextInsertPayment = `
      INSERT INTO
        public.payments
        (
          type_serial, id_invoice, id_user,
          created_at, total_payment, status,
          updated_at, gps_location, comments,
          text_ticket, printed_ticket
        )
      VALUES
        (3,$1, $2, $6, $3, 1, null, $4, $5, $7, $8) returning id_abono, created_at at time zone 'UTC' as created_at;
    `;

export const queryTextUpdateInvoiceStatus = `
      UPDATE 
        public.invoices
      SET 
        status=2
      WHERE 
        id_invoice =$1`;
export const queryStringPaymentsByRoute = `
      SELECT 
        p.id_abono, p.created_at, p.total_payment, p.id_invoice, p.text_ticket, p.printed_ticket
      FROM 
        payments p
      INNER JOIN 
        users u
      ON
        p.id_user=u.id_user
      INNER JOIN 
        invoices i
      ON
        i.id_invoice = p.id_invoice
      WHERE
        u.id_route = $1 and i.status = 1
      OR
        p.printed_ticket = false 
	    ORDER BY 
        p.created_at 
      DESC`;
export const queryTextGetPaymentsByDay2 = `
      SELECT 
        p.* , c.name as client_name, c.latitude, c.longitude
      FROM 
        payments p
      INNER JOIN
        invoices i
      ON
        p.id_invoice=i.id_invoice
      left JOIN
        clients c
      ON 
        i.id_client=c.id_client
      WHERE 
        CAST(p.created_at at time zone 'UTC' AS DATE)  = CAST($1 AS DATE);`;
export const queryTextGetPaymentsByDay = `
      SELECT 
        p.* , c.name
      FROM 
        payments p
      INNER JOIN
        invoices i
      ON
        p.id_invoice=i.id_invoice
      INNER JOIN
        clients c
      ON 
        i.id_client=c.id_client
      WHERE 
        CAST(p.created_at at time zone 'UTC' AS DATE)  = CAST(now() AS DATE);`;
export const fnGetPaymentsByWeek = `
    SELECT 
      * 
    FROM 
      public.fn_payments_by_week($1, $2)`;
export const queryTextUpdatePayment = `
    UPDATE 
      PUBLIC.payments
    SET 
      text_ticket=$2, printed_ticket=$3
    WHERE 
      id_abono=$1`;
