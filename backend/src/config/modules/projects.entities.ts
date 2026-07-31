import { EntityConfig } from "../../core/types";

/** Projects module. */
export const PROJECTS_ENTITIES: EntityConfig[] = [
  {
    entityKey: "project",
    module: "projects",
    toolPrefix: "project",
    canonicalFields: ["id", "display_name", "status", "percent_complete"],
    createFields: ["display_name"],
    description: "Projects",
  },
  {
    entityKey: "task",
    module: "projects",
    toolPrefix: "task",
    canonicalFields: ["id", "project", "subject", "status", "assigned_to"],
    createFields: ["project", "subject"],
    description: "Project tasks",
  },
];
