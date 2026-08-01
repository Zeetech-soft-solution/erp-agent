import { ModuleTrainingConfig } from "../../../core/types";

/**
 * Manufacturing training curation metadata — stub. Not yet curated;
 * populate pseudonymizeFields/retentionDays once this module gets real
 * business-rule coverage. Follow crm/training.ts or selling/training.ts
 * for the pattern.
 */
export const MANUFACTURING_TRAINING: ModuleTrainingConfig = {
  module: "manufacturing",
  pseudonymizeFields: [],
  notes: "Not yet curated.",
};
