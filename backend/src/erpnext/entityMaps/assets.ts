import { ErpNextEntityMapModule } from "./types";

export const ASSETS_MAP: ErpNextEntityMapModule = {
  asset: {
    doctype: "Asset",
    fieldMap: { id: "name", display_name: "asset_name", category: "asset_category", status: "status", purchase_date: "purchase_date" },
  },
  asset_maintenance: {
    doctype: "Asset Maintenance",
    fieldMap: { id: "name", asset: "asset_name", status: "maintenance_status" },
  },
};
