import { ErpNextEntityMapModule } from "./types";

export const CRM_MAP: ErpNextEntityMapModule = {
  lead: {
    doctype: "Lead",
    fieldMap: {
      id: "name", display_name: "lead_name", email: "email_id", phone: "mobile_no", status: "status",
      source: "source", owner: "lead_owner", company: "company_name", created: "creation",
    },
  },
  customer: {
    doctype: "Customer",
    fieldMap: { id: "name", display_name: "customer_name", group: "customer_group", territory: "territory" },
  },
  opportunity: {
    doctype: "Opportunity",
    fieldMap: { id: "name", party: "party_name", status: "status", amount: "opportunity_amount" },
  },
};
