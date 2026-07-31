import { ErpNextEntityMapModule } from "./types";

export const MANUFACTURING_MAP: ErpNextEntityMapModule = {
  bom: {
    doctype: "BOM",
    fieldMap: { id: "name", item: "item", quantity: "quantity", is_active: "is_active" },
  },
  work_order: {
    doctype: "Work Order",
    fieldMap: { id: "name", item: "production_item", bom: "bom_no", quantity: "qty", status: "status" },
  },
};
