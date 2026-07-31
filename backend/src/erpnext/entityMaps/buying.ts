import { ErpNextEntityMapModule } from "./types";

export const BUYING_MAP: ErpNextEntityMapModule = {
  supplier: {
    doctype: "Supplier",
    fieldMap: { id: "name", display_name: "supplier_name", group: "supplier_group" },
  },
  purchase_order: {
    doctype: "Purchase Order",
    fieldMap: { id: "name", supplier: "supplier", status: "status", total: "grand_total", date: "transaction_date" },
  },
  purchase_invoice: {
    doctype: "Purchase Invoice",
    fieldMap: { id: "name", supplier: "supplier", status: "status", total: "grand_total", due_date: "due_date" },
  },
};
