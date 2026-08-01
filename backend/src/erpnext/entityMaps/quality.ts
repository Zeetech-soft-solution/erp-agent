import { ErpNextEntityMapModule } from "./types";

export const QUALITY_MAP: ErpNextEntityMapModule = {
  quality_inspection: {
    doctype: "Quality Inspection",
    fieldMap: { id: "name", item: "item_code", status: "status", inspection_type: "inspection_type" },
  },
  quality_goal: {
    doctype: "Quality Goal",
    fieldMap: { id: "name", display_name: "goal", status: "status" },
  },
};
