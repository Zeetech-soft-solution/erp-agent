/** Shared shape for every per-module ERPNext entity map file. */
export interface ErpNextEntityMapping {
  doctype: string;
  fieldMap: Record<string, string>; // canonicalField -> erpnextField
}
export type ErpNextEntityMapModule = Record<string, ErpNextEntityMapping>;
