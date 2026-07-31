import { ReportConfig } from "../core/types";

/**
 * Canonical report list — same discipline as entities.config.ts: no
 * system-specific report names here. Each connector's report map
 * (erpnext/reportMap.ts, later sap/reportMap.ts) resolves reportKey to
 * whatever that system actually calls it internally.
 */
export const REPORT_CONFIGS: ReportConfig[] = [
  {
    reportKey: "stock_balance",
    module: "stock",
    description: "Current stock quantity/value per item and warehouse",
    filterFields: ["item", "warehouse", "as_of_date"],
  },
  {
    reportKey: "general_ledger",
    module: "accounting",
    description: "Detailed account-wise transaction ledger",
    filterFields: ["account", "from_date", "to_date"],
  },
  {
    reportKey: "accounts_receivable",
    module: "accounting",
    description: "Outstanding customer invoice aging",
    filterFields: ["customer", "as_of_date"],
  },

  // Append more here — canonical reportKey + module + filter names
  // only. Then add the matching entry to erpnext/reportMap.ts (and,
  // later, sap/reportMap.ts) so a provider knows how to actually run it.
];
