import { Session, ToolDefinition } from "./types";
import { moduleRegistry } from "./moduleRegistry";

export class ToolNotAllowedError extends Error {
  constructor(toolName: string) {
    super(`Tool "${toolName}" is not permitted for this user's role(s).`);
    this.name = "ToolNotAllowedError";
  }
}

/**
 * SINGLE enforcement + execution point for every tool call, whether it
 * comes from the LLM's own planning or a direct REST route. Nothing
 * else is allowed to call a tool handler directly — this is what makes
 * the role-based filtering trustworthy and auditable in one place.
 */
export async function callTool(session: Session, toolName: string, args: any) {
  const allowed = session.allowed_tools.includes("*") || session.allowed_tools.includes(toolName);
  if (!allowed) throw new ToolNotAllowedError(toolName);

  const tool = moduleRegistry.findTool(toolName);
  if (!tool) throw new Error(`Unknown tool: ${toolName}`);

  return tool.handler(args, session);
}

export function listAllowedTools(session: Session): ToolDefinition[] {
  const all = moduleRegistry.getAllTools();
  if (session.allowed_tools.includes("*")) return all;
  return all.filter((t) => session.allowed_tools.includes(t.name));
}
