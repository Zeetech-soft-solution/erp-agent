import { ErpNextEntityMapModule } from "./types";

export const STOCK_MAP: ErpNextEntityMapModule = {
  item: {
    doctype: "Item",
    fieldMap: { id: "name", display_name: "item_name", group: "item_group", uom: "stock_uom" },
  },
  warehouse: {
    doctype: "Warehouse",
    fieldMap: { id: "name", display_name: "warehouse_name" },
  },
  delivery_note: {
    doctype: "Delivery Note",
    fieldMap: { id: "name", customer: "customer", status: "status", date: "posting_date" },
  },
  stock_entry: {
    doctype: "Stock Entry",
    fieldMap: { id: "name", entry_type: "stock_entry_type", status: "status", date: "posting_date" },
  },
  material_request: {
    doctype: "Material Request",
    fieldMap: { id: "name", request_type: "material_request_type", status: "status", date: "transaction_date" },
  },
};
