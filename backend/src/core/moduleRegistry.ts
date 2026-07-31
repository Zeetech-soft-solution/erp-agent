import { MCPModule, ToolDefinition } from "./types";

/**
 * Central plugin registry. Modules register themselves here (see
 * bootstrap.ts) — nothing else in the system imports a module
 * directly. Adding module #5 never means editing this file.
 */
class ModuleRegistry {
  private modules = new Map<string, MCPModule>();

  register(module: MCPModule) {
    if (this.modules.has(module.name)) {
      throw new Error(`Module "${module.name}" already registered`);
    }
    for (const tool of module.tools) {
      if (this.findTool(tool.name)) {
        throw new Error(`Duplicate tool name across modules: "${tool.name}"`);
      }
    }
    this.modules.set(module.name, module);
  }

  getModules(): MCPModule[] {
    return Array.from(this.modules.values());
  }

  getAllTools(): ToolDefinition[] {
    return this.getModules().flatMap((m) => m.tools);
  }

  findTool(name: string): ToolDefinition | undefined {
    return this.getAllTools().find((t) => t.name === name);
  }
}

export const moduleRegistry = new ModuleRegistry();
