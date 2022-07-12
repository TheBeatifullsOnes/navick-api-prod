module.exports = {
  getInvoices: `
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
        i.total_amount is not null`,
  getInvoiceByIdinvoice: `
    SELECT 
        id_invoice,  id_client,  type_payment, status, created_at, expiration_date, total_amount, remaining_payment, discount
    FROM 
        public.invoices
    WHERE 
        id_invoice = $1`,
  insertInvoice: `
      INSERT INTO 
        public.invoices
        (
          id_type_serial, id_client, type_payment, 
          status, created_at, expiration_date, 
          total_amount, remaining_payment, discount
        )
      VALUES 
        (1, $1, $2, $3, $4, $5, $6, $7, $8) returning id_invoice`,
  getInvoicesByRoute: `
      SELECT 
        i.* 
      FROM
        invoices as i
      INNER JOIN 
        clients as c 
      ON 
        i.id_client=c.id_client
      WHERE
        c.id_route=$1 and (i.status = 1 or (select  p.printed_ticket from payments p where id_invoice = i.id_invoice and p.printed_ticket = false limit 1) = false)
      ORDER BY 
        i.id_invoice 
      DESC`,
  getInvoiceByClientId: `
    SELECT
        *
    FROM
        public.invoices
    WHERE
        id_client = $1`,
  updateInvoiceByIdinvoice: `
    UPDATE 
        public.invoices
    SET 
        id_client=$2, type_payment=$3, status=$4, 
        expiration_date=$5, total_amount=$6, remaining_payment=$7, 
        discount=$8
    WHERE 
        id_invoice=$1`,
  getRemainingPaymentByIdinvoice: `
      SELECT 
        remaining_payment 
      FROM 
        invoices 
      WHERE 
        id_invoice = $1
      `,
  updateRemainingPaymentByIdinvoice: `
      UPDATE 
        public.invoices
	    SET 
        remaining_payment=$2
	    WHERE 
        id_invoice =$1;
      `,
  insertDetailsInvoices: `
        INSERT INTO 
          public.details_invoices
          (
	          id_invoice, line, id_product,
            quantity, price, id_warehouse
          )
	      VALUES ($1, $2, $3, $4, $5, $6);`,
  getIvoicesByCurrentDay: `
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
        c.id_route = $1`,
  getRemainingPaymentToCancel: `
      SELECT 
        remaining_payment, status
      FROM 
        invoices 
      WHERE 
        id_invoice = $1`,
  updateInvoiceStatus: `
        UPDATE 
          public.invoices
        SET 
          status=3,
          remaining_payment=$2
        WHERE 
          id_invoice =$1`,
  insertPaymentInCancel: `
        INSERT INTO
          public.payments
          (
            type_serial, id_invoice, id_user,
            created_at, total_payment, status,
            updated_at, gps_location, comments,
            text_ticket, printed_ticket
          )
        VALUES
          (3, $1, $2, $8, $3, 1, null, $4, $5, $6, $7) returning id_abono, created_at at time zone 'UTC' as created_at;
      `,
};
