import { EntityConfig } from "../../core/types";

/** Manufacturing module. */
export const MANUFACTURING_ENTITIES: EntityConfig[] = [
  {
    entityKey: "bom",
    module: "manufacturing",
    toolPrefix: "bom",
    canonicalFields: ["id", "item", "quantity", "is_active"],
    operations: ["list", "get"],
    description: "Bills of material",
  },
  {
    entityKey: "work_order",
    module: "manufacturing",
    toolPrefix: "work_order",
    canonicalFields: ["id", "item", "bom", "quantity", "status"],
    createFields: ["item", "bom", "quantity"],
    description: "Manufacturing work orders",
  },
];
