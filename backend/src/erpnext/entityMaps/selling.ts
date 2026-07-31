import { ErpNextEntityMapModule } from "./types";

export const SELLING_MAP: ErpNextEntityMapModule = {
  quotation: {
    doctype: "Quotation",
    fieldMap: { id: "name", party: "party_name", status: "status", total: "grand_total", date: "transaction_date" },
  },
  sales_order: {
    doctype: "Sales Order",
    fieldMap: { id: "name", customer: "customer", status: "status", total: "grand_total", date: "transaction_date" },
  },
  sales_invoice: {
    doctype: "Sales Invoice",
    fieldMap: { id: "name", customer: "customer", status: "status", total: "grand_total", due_date: "due_date" },
  },
};
