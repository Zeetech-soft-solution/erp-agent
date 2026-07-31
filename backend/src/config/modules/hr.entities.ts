import { EntityConfig } from "../../core/types";

/** HR module. */
export const HR_ENTITIES: EntityConfig[] = [
  {
    entityKey: "employee",
    module: "hr",
    toolPrefix: "employee",
    canonicalFields: ["id", "display_name", "department", "designation", "status"],
    operations: ["list", "get"],
    description: "Employee records",
  },
  {
    entityKey: "leave_application",
    module: "hr",
    toolPrefix: "leave_application",
    canonicalFields: ["id", "employee", "leave_type", "from_date", "to_date", "status"],
    createFields: ["employee", "leave_type", "from_date", "to_date"],
    description: "Employee leave requests",
  },
  {
    entityKey: "attendance",
    module: "hr",
    toolPrefix: "attendance",
    canonicalFields: ["id", "employee", "date", "status"],
    operations: ["list", "get"],
    description: "Daily attendance records",
  },
];
