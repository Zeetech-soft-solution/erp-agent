import { EntityConfig } from "../../../core/types";

/** Buying module — procurement side, mirrors Selling's shape. */
export const BUYING_ENTITIES: EntityConfig[] = [
  {
    entityKey: "supplier",
    module: "buying",
    toolPrefix: "supplier",
    canonicalFields: ["id", "display_name", "group"],
    operations: ["list", "get"],
    description: "Suppliers/vendors",
  },
  {
    entityKey: "purchase_order",
    module: "buying",
    toolPrefix: "purchase_order",
    canonicalFields: ["id", "supplier", "status", "total", "date"],
    createFields: ["supplier"],
    description: "Purchase orders",
  },
  {
    entityKey: "purchase_invoice",
    module: "buying",
    toolPrefix: "purchase_invoice",
    canonicalFields: ["id", "supplier", "status", "total", "due_date"],
    operations: ["list", "get"],
    description: "Purchase invoices (bills)",
  },
  {
    entityKey: "request_for_quotation",
    module: "buying",
    toolPrefix: "rfq",
    canonicalFields: ["id", "status", "date"],
    operations: ["list", "get"],
    description: "Requests for quotation sent to suppliers",
  },
  {
    entityKey: "supplier_quotation",
    module: "buying",
    toolPrefix: "supplier_quotation",
    canonicalFields: ["id", "supplier", "status", "total"],
    operations: ["list", "get"],
    description: "Quotations received back from suppliers",
  },
];
