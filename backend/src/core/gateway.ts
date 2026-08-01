import { Session, ToolDefinition } from "./types";
import { moduleRegistry } from "./moduleRegistry";
import { businessRuleEngine } from "./businessRuleEngine";
import { ruleOutcomeLogger } from "./ruleOutcomeLogger";

export class ToolNotAllowedError extends Error {
  constructor(toolName: string) {
    super(`Tool "${toolName}" is not permitted for this user's role(s).`);
    this.name = "ToolNotAllowedError";
  }
}

export class RuleViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuleViolationError";
  }
}

/**
 * SINGLE enforcement + execution point for every tool call, whether it
 * comes from the LLM's own planning or a direct REST route. Nothing
 * else is allowed to call a tool handler directly — this is what makes
 * the role-based filtering and business-rule enforcement trustworthy
 * and auditable in one place.
 */
export async function callTool(session: Session, toolName: string, args: any) {
  const allowed = session.allowed_tools.includes("*") || session.allowed_tools.includes(toolName);
  if (!allowed) throw new ToolNotAllowedError(toolName);

  const tool = moduleRegistry.findTool(toolName);
  if (!tool) throw new Error(`Unknown tool: ${toolName}`);

  if (tool.entityKey && tool.ruleAction) {
    const evaluation = await businessRuleEngine.evaluate(tool.entityKey, tool.ruleAction, args, session);
    await ruleOutcomeLogger.log({
      entity_key: tool.entityKey,
      action: tool.ruleAction,
      actor_email: session.sub,
      allowed: evaluation.allowed,
      violations: evaluation.violations,
      args,
      created_at: new Date().toISOString(),
    });
    if (!evaluation.allowed) {
      throw new RuleViolationError(evaluation.violations.map((v) => v.message).join(" "));
    }
  }

  return tool.handler(args, session);
}

export function listAllowedTools(session: Session): ToolDefinition[] {
  const all = moduleRegistry.getAllTools();
  if (session.allowed_tools.includes("*")) return all;
  return all.filter((t) => session.allowed_tools.includes(t.name));
}
