import { EntityConfig } from "../../core/types";

/** Stock/inventory module. */
export const STOCK_ENTITIES: EntityConfig[] = [
  {
    entityKey: "item",
    module: "stock",
    toolPrefix: "item",
    canonicalFields: ["id", "display_name", "group", "uom"],
    operations: ["list", "get"],
    description: "Stock/inventory items",
  },
  {
    entityKey: "warehouse",
    module: "stock",
    toolPrefix: "warehouse",
    canonicalFields: ["id", "display_name"],
    operations: ["list", "get"],
    description: "Storage locations",
  },
  {
    entityKey: "delivery_note",
    module: "stock",
    toolPrefix: "delivery_note",
    canonicalFields: ["id", "customer", "status", "date"],
    operations: ["list", "get"],
    description: "Outbound goods delivery documents",
  },
];
