import { BusinessRule, RuleSet, RuleViolation, Session } from "./types";

export interface RuleEvaluation {
  allowed: boolean;
  violations: RuleViolation[];
}

/**
 * Domain-agnostic business-rule engine — same shape and discipline as
 * workflowEngine.ts: a generic engine here, one small per-module
 * RuleSet in config/rules/<module>.rules.ts describing what "normal
 * practice" actually is for that entity. Has no idea whether the
 * entity underneath is an ERPNext Lead, an SAP sales document, or a
 * patient admission record.
 */
class BusinessRuleEngine {
  private ruleSets = new Map<string, BusinessRule[]>();

  register(ruleSet: RuleSet) {
    const existing = this.ruleSets.get(ruleSet.entityKey) || [];
    this.ruleSets.set(ruleSet.entityKey, [...existing, ...ruleSet.rules]);
  }

  async evaluate(
    entityKey: string,
    action: "create" | "update",
    args: Record<string, any>,
    session: Session,
    current?: Record<string, any>
  ): Promise<RuleEvaluation> {
    const rules = (this.ruleSets.get(entityKey) || []).filter((r) => r.action === action);
    const violations: RuleViolation[] = [];

    for (const rule of rules) {
      const violation = await rule.check(args, session, current);
      if (violation) violations.push(violation);
    }

    return { allowed: !violations.some((v) => v.blocking), violations };
  }
}

export const businessRuleEngine = new BusinessRuleEngine();
