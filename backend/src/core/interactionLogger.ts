import { InteractionLogger, InteractionRecord } from "./types";
import { appConfig } from "../config/app.config";
import { Pool } from "pg";

/**
 * Every reasoning-engine run is logged here from day one — this table
 * IS the training dataset plan (see docs/TRAINING_PLAN.md). Swapping
 * storage later (e.g. also streaming to a data warehouse) means adding
 * a second InteractionLogger implementation and calling both, not
 * rewriting reasoningEngine.ts.
 */
export class PostgresInteractionLogger implements InteractionLogger {
  private pool: Pool | null = appConfig.db.postgresUrl ? new Pool({ connectionString: appConfig.db.postgresUrl }) : null;

  async log(record: InteractionRecord): Promise<void> {
    if (!this.pool) return; // safe no-op until DATABASE_URL is configured
    await this.pool.query(
      `insert into interaction_log
        (actor_email, roles, prompt, context_sources_used, tool_calls, response_type, render_kind, latency_ms, created_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        record.actor_email,
        record.roles,
        record.prompt,
        record.context_sources_used,
        JSON.stringify(record.tool_calls),
        record.response_type,
        record.render_kind || null,
        record.latency_ms,
        record.created_at,
      ]
    );
  }
}
