import { ModuleTrainingConfig } from "../../../core/types";

/**
 * Buying training curation metadata — stub. Not yet curated;
 * populate pseudonymizeFields/retentionDays once this module gets real
 * business-rule coverage. Follow crm/training.ts or selling/training.ts
 * for the pattern.
 */
export const BUYING_TRAINING: ModuleTrainingConfig = {
  module: "buying",
  pseudonymizeFields: [],
  notes: "Not yet curated.",
};
