import { Pool } from "pg";
import { appConfig } from "../config/app.config";

export interface SettingRow {
  key: string;
  value: any;
  label: string;
  description: string | null;
  value_type: "string" | "number" | "boolean";
  updated_by: string | null;
  updated_at: string;
}

/**
 * DB-backed, hot-reloadable OPERATIONAL settings — deliberately separate
 * from app.config.ts, which is env-driven and only re-read on process
 * restart. Anything a non-technical admin should be able to change
 * live belongs here; anything security-sensitive belongs in .env.
 *
 * Small in-memory cache with a short TTL so every reasoning-engine run
 * doesn't hit Postgres for settings on every prompt.
 */
class SettingsService {
  private pool: Pool | null = appConfig.db.postgresUrl ? new Pool({ connectionString: appConfig.db.postgresUrl }) : null;
  private cache: SettingRow[] | null = null;
  private cacheAt = 0;
  private ttlMs = 15000;

  async list(): Promise<SettingRow[]> {
    if (!this.pool) return [];
    if (this.cache && Date.now() - this.cacheAt < this.ttlMs) return this.cache;
    const { rows } = await this.pool.query(`select * from settings order by key`);
    this.cache = rows;
    this.cacheAt = Date.now();
    return rows;
  }

  async get<T = any>(key: string, fallback: T): Promise<T> {
    const rows = await this.list();
    const row = rows.find((r) => r.key === key);
    return row ? (row.value as T) : fallback;
  }

  async update(key: string, value: any, adminUser: string): Promise<SettingRow> {
    if (!this.pool) throw new Error("Settings store not configured (DATABASE_URL missing)");
    const before = await this.pool.query(`select * from settings where key = $1`, [key]);
    if (!before.rows[0]) throw new Error(`Unknown setting: ${key}`);

    const { rows } = await this.pool.query(
      `update settings set value = $1, updated_by = $2, updated_at = now() where key = $3 returning *`,
      [JSON.stringify(value), adminUser, key]
    );

    await this.pool.query(
      `insert into admin_audit_log (admin_user, action, target, before, after) values ($1,$2,$3,$4,$5)`,
      [adminUser, "update_setting", key, JSON.stringify(before.rows[0].value), JSON.stringify(value)]
    );

    this.cache = null; // invalidate
    return rows[0];
  }
}

export const settingsService = new SettingsService();
