import { ErpNextEntityMapModule } from "./types";

export const ACCOUNTING_MAP: ErpNextEntityMapModule = {
  journal_entry: {
    doctype: "Journal Entry",
    fieldMap: { id: "name", date: "posting_date", total_debit: "total_debit", total_credit: "total_credit", status: "docstatus" },
  },
  payment_entry: {
    doctype: "Payment Entry",
    fieldMap: { id: "name", party: "party", amount: "paid_amount", date: "posting_date", status: "status" },
  },
  account: {
    doctype: "Account",
    fieldMap: { id: "name", display_name: "account_name", type: "account_type" },
  },
};
