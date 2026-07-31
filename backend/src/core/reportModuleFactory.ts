import { MCPModule, ToolDefinition, ReportConfig } from "./types";
import { systemConnector } from "../config/system.config";

/**
 * Generates one MCP tool per named report, calling ONLY through
 * systemConnector.runReport() — same discipline as entityModuleFactory.
 * A report is read-only by nature, always passes session.credential so
 * results respect whatever row/field-level permissions the acting
 * person has on the underlying system (ERPNext reports are permission-
 * scoped per user, not just per role).
 */
export function buildReportModule(config: ReportConfig): MCPModule {
  const toolName = config.toolName || `${config.module}.report.${config.reportKey}`;
  const tool: ToolDefinition = {
    name: toolName,
    description: config.description || `Run the "${config.reportKey}" report`,
    module: config.module,
    parameters: { type: "object", properties: { filters: { type: "object" } } },
    handler: (args, session) => systemConnector.runReport(config.reportKey, session.credential, args?.filters),
  };
  return { name: toolName, description: config.description || `${config.reportKey} report`, tools: [tool] };
}

export function buildReportModules(configs: ReportConfig[]): MCPModule[] {
  return configs.map(buildReportModule);
}
