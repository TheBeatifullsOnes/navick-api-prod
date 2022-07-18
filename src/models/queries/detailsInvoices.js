export const getDetailsInvoicesById = `
  SELECT 
    id_invoice, line, id_product, quantity, price, id_warehouse
  FROM 
    public.details_invoices 
  WHERE 
    id_invoice=$1
`;
export const insertDetailsInvoices = `
  INSERT 
  INTO 
    public.details_invoices
    (id_factura, linea, id_articulo, cantidad, precio, id_almacen)
  VALUES ($1, $2, $3, $4, $5, $6)`;
