import { RuleSet } from "../../../core/types";
import { systemConnector } from "../../system.config";

/**
 * CRM module rules — one of two populated business-rule sets today
 * (the other is selling/rules.ts), proving the pattern against
 * ERPNext's Lead entity. Illustrative starter set, not exhaustive
 * coverage: to extend, add rules to this file's array. Every other
 * module's rules.ts follows this same shape.
 */
export const CRM_RULES: RuleSet[] = [
  {
    entityKey: "lead",
    rules: [
      {
        id: "lead.require_contact_method",
        action: "create",
        description: "A lead needs at least one way to be contacted",
        check: (args) => {
          if (!args?.email && !args?.phone) {
            return {
              ruleId: "lead.require_contact_method",
              message: "A lead needs at least an email or a phone number.",
              blocking: true,
            };
          }
          return null;
        },
      },
      {
        id: "lead.warn_duplicate_email",
        action: "create",
        description: "Flag (don't block) creating a lead whose email already exists",
        check: async (args, session) => {
          if (!args?.email) return null;
          const existing = await systemConnector.list("lead", session.credential, { filters: { email: args.email }, limit: 1 });
          if (existing.length > 0) {
            return {
              ruleId: "lead.warn_duplicate_email",
              message: `A lead with email "${args.email}" already exists (${existing[0].display_name || existing[0].id}).`,
              blocking: false,
            };
          }
          return null;
        },
      },
      {
        id: "lead.convert_requires_manager",
        action: "update",
        description: "Only a Sales Manager or System Manager can mark a lead Converted directly",
        check: (args, session) => {
          if (args?.status !== "Converted") return null;
          const allowedRoles = ["Sales Manager", "System Manager"];
          if (!allowedRoles.some((r) => session.erpnext_roles.includes(r))) {
            return {
              ruleId: "lead.convert_requires_manager",
              message: `Converting a lead directly requires one of: ${allowedRoles.join(", ")}.`,
              blocking: true,
            };
          }
          return null;
        },
      },
    ],
  },
];
