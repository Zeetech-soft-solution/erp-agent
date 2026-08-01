import { EntityConfig } from "../../../core/types";

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
  {
    entityKey: "salary_slip",
    module: "hr",
    toolPrefix: "salary_slip",
    canonicalFields: ["id", "employee", "status", "net_pay", "start_date", "end_date"],
    operations: ["list", "get"],
    description: "Payroll — an employee's salary slip for a pay period",
  },
  {
    entityKey: "job_opening",
    module: "hr",
    toolPrefix: "job_opening",
    canonicalFields: ["id", "display_name", "department", "status"],
    createFields: ["display_name", "department"],
    description: "Recruitment — open positions",
  },
];
