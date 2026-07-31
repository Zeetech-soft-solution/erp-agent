import { MCPModule } from "../../core/types";

/**
 * STUB — external support-desk MCP. Replace the handler body with a
 * real call to your ticketing system's API/MCP server. Kept read-only
 * on purpose; role policy currently only grants this to Sales Manager+.
 */
export const ticketsModule: MCPModule = {
  name: "tickets",
  description: "Read-only access to assigned support tickets (external MCP)",
  tools: [
    {
      name: "tickets.list",
      description: "List support tickets assigned to the current user",
      module: "tickets",
      parameters: { type: "object", properties: { status: { type: "string" } } },
      handler: async () => ({ note: "tickets MCP not yet connected — wire real API here" }),
    },
  ],
};
