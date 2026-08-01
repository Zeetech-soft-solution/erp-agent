import { ModuleTrainingConfig } from "../../../core/types";

/**
 * Projects training curation metadata — stub. Not yet curated;
 * populate pseudonymizeFields/retentionDays once this module gets real
 * business-rule coverage. Follow crm/training.ts or selling/training.ts
 * for the pattern.
 */
export const PROJECTS_TRAINING: ModuleTrainingConfig = {
  module: "projects",
  pseudonymizeFields: [],
  notes: "Not yet curated.",
};
