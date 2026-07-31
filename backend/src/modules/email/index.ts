import { MCPModule } from "../../core/types";

/**
 * STUB — external email MCP. "list" is read-only; "draft" composes but
 * deliberately does NOT send — sending should be its own separate tool
 * (email.send) added later and gated to a narrower role set once trusted.
 */
export const emailModule: MCPModule = {
  name: "email",
  description: "Read and draft (never send) email (external MCP)",
  tools: [
    {
      name: "email.list",
      description: "List recent emails for the current user",
      module: "email",
      parameters: { type: "object", properties: { folder: { type: "string" } } },
      handler: async () => ({ note: "email MCP not yet connected — wire real API here" }),
    },
    {
      name: "email.draft",
      description: "Draft an email reply without sending it",
      module: "email",
      parameters: { type: "object", properties: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" } } },
      handler: async (args) => ({ note: "drafting not yet implemented", draft: args }),
    },
  ],
};
