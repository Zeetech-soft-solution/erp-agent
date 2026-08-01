import { EntityConfig } from "../../../core/types";

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
  {
    entityKey: "job_card",
    module: "manufacturing",
    toolPrefix: "job_card",
    canonicalFields: ["id", "work_order", "operation", "status"],
    operations: ["list", "get"],
    description: "Shop-floor tracking of a single work order operation",
  },
  {
    entityKey: "production_plan",
    module: "manufacturing",
    toolPrefix: "production_plan",
    canonicalFields: ["id", "status", "date"],
    operations: ["list", "get"],
    description: "Aggregated production planning across multiple sales/work orders",
  },
];
