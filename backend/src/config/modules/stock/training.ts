import { ModuleTrainingConfig } from "../../../core/types";

/**
 * Stock training curation metadata — stub. Not yet curated;
 * populate pseudonymizeFields/retentionDays once this module gets real
 * business-rule coverage. Follow crm/training.ts or selling/training.ts
 * for the pattern.
 */
export const STOCK_TRAINING: ModuleTrainingConfig = {
  module: "stock",
  pseudonymizeFields: [],
  notes: "Not yet curated.",
};
