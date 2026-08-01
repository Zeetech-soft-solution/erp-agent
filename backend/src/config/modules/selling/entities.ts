import { EntityConfig } from "../../../core/types";

/** Selling module — quoting through invoicing a customer. */
export const SELLING_ENTITIES: EntityConfig[] = [
  {
    entityKey: "quotation",
    module: "selling",
    toolPrefix: "quotation",
    canonicalFields: ["id", "party", "status", "total", "date"],
    createFields: ["party"],
    description: "Sales quotations",
  },
  {
    entityKey: "sales_order",
    module: "selling",
    toolPrefix: "sales_order",
    canonicalFields: ["id", "customer", "status", "total", "date"],
    createFields: ["customer"],
    description: "Sales orders",
  },
  {
    entityKey: "sales_invoice",
    module: "selling",
    toolPrefix: "sales_invoice",
    canonicalFields: ["id", "customer", "status", "total", "due_date"],
    operations: ["list", "get"],
    description: "Sales invoices",
  },
];
