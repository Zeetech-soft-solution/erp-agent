import { EntityConfig } from "../../core/types";

/** CRM module. "lead" itself is hand-written in modules/crm/ (has real
 *  business logic beyond CRUD) — these are its generic siblings. */
export const CRM_ENTITIES: EntityConfig[] = [
  {
    entityKey: "customer",
    module: "crm",
    toolPrefix: "customer",
    canonicalFields: ["id", "display_name", "group", "territory"],
    operations: ["list", "get"],
    description: "Customer accounts",
  },
  {
    entityKey: "opportunity",
    module: "crm",
    toolPrefix: "opportunity",
    canonicalFields: ["id", "party", "status", "amount"],
    createFields: ["party", "amount"],
    description: "Sales opportunities",
  },
];
