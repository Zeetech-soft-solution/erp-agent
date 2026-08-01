import { EntityConfig } from "../../../core/types";

/** Assets module — fixed asset tracking and maintenance. */
export const ASSETS_ENTITIES: EntityConfig[] = [
  {
    entityKey: "asset",
    module: "assets",
    toolPrefix: "asset",
    canonicalFields: ["id", "display_name", "category", "status", "purchase_date"],
    operations: ["list", "get"],
    description: "Fixed assets",
  },
  {
    entityKey: "asset_maintenance",
    module: "assets",
    toolPrefix: "asset_maintenance",
    canonicalFields: ["id", "asset", "status"],
    operations: ["list", "get"],
    description: "Scheduled/logged maintenance against an asset",
  },
];
