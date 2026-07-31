import { EntityConfig } from "../core/types";
import { CRM_ENTITIES } from "./modules/crm.entities";
import { SELLING_ENTITIES } from "./modules/selling.entities";
import { BUYING_ENTITIES } from "./modules/buying.entities";
import { STOCK_ENTITIES } from "./modules/stock.entities";
import { ACCOUNTING_ENTITIES } from "./modules/accounting.entities";
import { HR_ENTITIES } from "./modules/hr.entities";
import { MANUFACTURING_ENTITIES } from "./modules/manufacturing.entities";
import { PROJECTS_ENTITIES } from "./modules/projects.entities";

/**
 * ERP-AGNOSTIC entity list, ASSEMBLED from one file per standard ERP
 * module (config/modules/*.entities.ts) — the same module taxonomy
 * every mainstream ERP mirrors in some form (CRM, Selling, Buying,
 * Stock, Accounting, HR, Manufacturing, Projects...). This split
 * exists purely for editing speed: to add/adjust one module's entity
 * coverage, open ONE small file instead of scrolling a monolith.
 *
 * Every entry here is canonical — no doctype names, no ERP-specific
 * field names, ever. That translation lives entirely in
 * erpnext/entityMaps/*.ts (mirrored one-to-one with these files) and,
 * later, sap/entityMaps/*.ts. This file, roles.policy.ts, and every
 * tool built from it stay identical whether SYSTEM_PROVIDER is
 * "erpnext" or "sap" — only the per-provider entity map differs.
 *
 * To add a new module: create config/modules/<name>.entities.ts
 * following the same shape, import + spread it below, then create the
 * matching erpnext/entityMaps/<name>.ts. Nothing else changes.
 */
export const ENTITY_CONFIGS: EntityConfig[] = [
  ...CRM_ENTITIES,
  ...SELLING_ENTITIES,
  ...BUYING_ENTITIES,
  ...STOCK_ENTITIES,
  ...ACCOUNTING_ENTITIES,
  ...HR_ENTITIES,
  ...MANUFACTURING_ENTITIES,
  ...PROJECTS_ENTITIES,
];
