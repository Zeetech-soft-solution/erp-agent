import { ModuleTrainingConfig } from "../../../core/types";

/**
 * Accounting training curation metadata — stub. Not yet curated;
 * populate pseudonymizeFields/retentionDays once this module gets real
 * business-rule coverage. Follow crm/training.ts or selling/training.ts
 * for the pattern.
 */
export const ACCOUNTING_TRAINING: ModuleTrainingConfig = {
  module: "accounting",
  pseudonymizeFields: [],
  notes: "Not yet curated.",
};
