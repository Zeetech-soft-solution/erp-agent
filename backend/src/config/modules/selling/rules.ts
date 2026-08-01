import { RuleSet } from "../../../core/types";
import { systemConnector } from "../../system.config";

/**
 * Selling module rules — the other populated business-rule set today
 * (alongside crm/rules.ts), covering Quotation as the demo's second
 * real module. Illustrative starter set, not exhaustive coverage.
 *
 * NOTE on args shape: "quotation" has no hand-written module (unlike
 * "lead") — its create/update tools are generated generically by
 * core/entityModuleFactory.ts. That factory's update tool takes
 * `{ id, fields }`, not flat fields like crm.update_lead_status does —
 * so this file's update rule reads `args.fields.status`, not
 * `args.status`. Copy-pasting a crm-style rule onto a factory-built
 * entity without adjusting for this is a common mistake.
 */
export const SELLING_RULES: RuleSet[] = [
  {
    entityKey: "quotation",
    rules: [
      {
        id: "quotation.warn_duplicate_open",
        action: "create",
        description: "Flag (don't block) creating a quotation for a party that already has one open",
        check: async (args, session) => {
          if (!args?.party) return null;
          const existing = await systemConnector.list("quotation", session.credential, {
            filters: { party: args.party },
            limit: 5,
          });
          const open = existing.filter((q) => q.status && !["Ordered", "Lost", "Cancelled", "Expired"].includes(q.status));
          if (open.length > 0) {
            return {
              ruleId: "quotation.warn_duplicate_open",
              message: `"${args.party}" already has an open quotation (${open[0].id}).`,
              blocking: false,
            };
          }
          return null;
        },
      },
      {
        id: "quotation.ordered_requires_manager",
        action: "update",
        description: "Only a Sales Manager or System Manager can mark a quotation Ordered directly",
        check: (args, session) => {
          if (args?.fields?.status !== "Ordered") return null;
          const allowedRoles = ["Sales Manager", "System Manager"];
          if (!allowedRoles.some((r) => session.erpnext_roles.includes(r))) {
            return {
              ruleId: "quotation.ordered_requires_manager",
              message: `Marking a quotation Ordered directly requires one of: ${allowedRoles.join(", ")}.`,
              blocking: true,
            };
          }
          return null;
        },
      },
    ],
  },
];
