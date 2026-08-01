import { EntityConfig } from "../../../core/types";

/** Quality Management module — inspections and quality process tracking. */
export const QUALITY_ENTITIES: EntityConfig[] = [
  {
    entityKey: "quality_inspection",
    module: "quality",
    toolPrefix: "quality_inspection",
    canonicalFields: ["id", "item", "status", "inspection_type"],
    operations: ["list", "get"],
    description: "Incoming/outgoing/in-process quality inspections",
  },
  {
    entityKey: "quality_goal",
    module: "quality",
    toolPrefix: "quality_goal",
    canonicalFields: ["id", "display_name", "status"],
    operations: ["list", "get"],
    description: "Quality objectives being tracked",
  },
];
