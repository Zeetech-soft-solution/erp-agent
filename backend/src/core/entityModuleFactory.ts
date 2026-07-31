import { MCPModule, ToolDefinition, EntityConfig } from "./types";
import { systemConnector } from "../config/system.config";

/**
 * Generates list/get/create/update tools for any canonical entity,
 * calling ONLY through systemConnector — never a specific ERP's client.
 * Every call passes session.credential, so the resulting ERPNext (or
 * SAP) record is created/modified AS the actual logged-in person, not
 * the agent's own service account — see core/types.ts UserCredential.
 */
function toToolName(prefix: string, action: string) {
  return `${prefix}.${action}`;
}

export function buildEntityModule(config: EntityConfig): MCPModule {
  const ops = config.operations || ["list", "get", "create", "update"];
  const tools: ToolDefinition[] = [];

  if (ops.includes("list")) {
    tools.push({
      name: toToolName(config.toolPrefix, "list"),
      description: `List ${config.entityKey} records${config.description ? " — " + config.description : ""}`,
      module: config.module,
      parameters: { type: "object", properties: { filters: { type: "object" } } },
      handler: (args, session) => systemConnector.list(config.entityKey, session.credential, { filters: args?.filters }),
    });
  }

  if (ops.includes("get")) {
    tools.push({
      name: toToolName(config.toolPrefix, "get"),
      description: `Get a single ${config.entityKey} record by id`,
      module: config.module,
      parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
      handler: (args, session) => systemConnector.get(config.entityKey, session.credential, args.id),
    });
  }

  if (ops.includes("create")) {
    tools.push({
      name: toToolName(config.toolPrefix, "create"),
      description: `Create a new ${config.entityKey} record`,
      module: config.module,
      parameters: {
        type: "object",
        properties: Object.fromEntries((config.createFields || config.canonicalFields).map((f) => [f, {}])),
      },
      handler: (args, session) => systemConnector.create(config.entityKey, session.credential, args),
    });
  }

  if (ops.includes("update")) {
    tools.push({
      name: toToolName(config.toolPrefix, "update"),
      description: `Update fields on an existing ${config.entityKey} record`,
      module: config.module,
      parameters: {
        type: "object",
        properties: { id: { type: "string" }, fields: { type: "object" } },
        required: ["id", "fields"],
      },
      handler: (args, session) => systemConnector.update(config.entityKey, session.credential, args.id, args.fields),
    });
  }

  return { name: config.toolPrefix, description: config.description || `${config.entityKey} operations`, tools };
}

export function buildEntityModules(configs: EntityConfig[]): MCPModule[] {
  return configs.map(buildEntityModule);
}
