import { EntityConfig } from "../../../core/types";

/** Accounting module. */
export const ACCOUNTING_ENTITIES: EntityConfig[] = [
  {
    entityKey: "journal_entry",
    module: "accounting",
    toolPrefix: "journal_entry",
    canonicalFields: ["id", "date", "total_debit", "total_credit", "status"],
    operations: ["list", "get"],
    description: "Manual accounting journal entries",
  },
  {
    entityKey: "payment_entry",
    module: "accounting",
    toolPrefix: "payment_entry",
    canonicalFields: ["id", "party", "amount", "date", "status"],
    operations: ["list", "get"],
    description: "Payment records",
  },
  {
    entityKey: "account",
    module: "accounting",
    toolPrefix: "account",
    canonicalFields: ["id", "display_name", "type"],
    operations: ["list", "get"],
    description: "Chart of accounts",
  },
  {
    entityKey: "cost_center",
    module: "accounting",
    toolPrefix: "cost_center",
    canonicalFields: ["id", "display_name", "is_group"],
    operations: ["list", "get"],
    description: "Cost centers for expense/revenue tracking",
  },
];
