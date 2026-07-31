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
};
