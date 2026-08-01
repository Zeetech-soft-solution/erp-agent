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
  job_card: {
    doctype: "Job Card",
    fieldMap: { id: "name", work_order: "work_order", operation: "operation", status: "status" },
  },
  production_plan: {
    doctype: "Production Plan",
    fieldMap: { id: "name", status: "status", date: "posting_date" },
  },
};
