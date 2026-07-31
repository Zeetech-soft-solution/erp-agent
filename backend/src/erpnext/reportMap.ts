/**
 * Canonical reportKey -> ERPNext's actual report name + filter field
 * mapping. ERPNext runs standard reports via a single generic endpoint
 * (frappe.desk.query_report.run) regardless of report type — this file
 * is what makes that ERPNext-specific mechanism invisible to core.
 *
 * NOTE: ERPNext's report output shape (columns as strings vs objects,
 * result as arrays vs dicts) varies by report type and ERPNext version.
 * erpnextConnector.ts normalizes best-effort — verify against your
 * actual ERPNext instance and adjust normalizeReportResult() there if
 * a specific report's shape doesn't match.
 */
export interface ErpNextReportMapping {
  reportName: string;
  filterFieldMap: Record<string, string>; // canonicalFilter -> ERPNext filter key
}

export const ERPNEXT_REPORT_MAP: Record<string, ErpNextReportMapping> = {
  stock_balance: {
    reportName: "Stock Balance",
    filterFieldMap: { item: "item_code", warehouse: "warehouse", as_of_date: "to_date" },
  },
  general_ledger: {
    reportName: "General Ledger",
    filterFieldMap: { account: "account", from_date: "from_date", to_date: "to_date" },
  },
  accounts_receivable: {
    reportName: "Accounts Receivable",
    filterFieldMap: { customer: "customer", as_of_date: "report_date" },
  },

  // Append here as you cover more reports — one entry, canonical
  // filter names on the left, ERPNext's actual filter keys on the right.
};
