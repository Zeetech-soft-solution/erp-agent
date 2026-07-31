import { ContextProvider, ContextChunk, Session } from "../../core/types";
import { appConfig } from "../../config/app.config";

/**
 * HOT tier. In-memory to start (swap the internal Map for Redis later —
 * this class's public shape doesn't change, only its constructor).
 * Stores recent turns per user + "entities in focus" (referenced by id,
 * not dumped as full text) so the LLM has short-term continuity without
 * re-sending full history every turn.
 */
interface Turn { prompt: string; summary: string; }

class SessionCacheProvider implements ContextProvider {
  name = "session_cache";
  private turnsByUser = new Map<string, Turn[]>();
  private focusByUser = new Map<string, Record<string, string>>(); // e.g. { current_lead: "LEAD-0001" }

  addTurn(userId: string, turn: Turn) {
    const list = this.turnsByUser.get(userId) || [];
    list.push(turn);
    while (list.length > appConfig.context.sessionCacheTurns) list.shift();
    this.turnsByUser.set(userId, list);
  }

  setFocus(userId: string, key: string, value: string) {
    const map = this.focusByUser.get(userId) || {};
    map[key] = value;
    this.focusByUser.set(userId, map);
  }

  async fetch(session: Session, _prompt: string, budgetChars: number): Promise<ContextChunk[]> {
    const turns = this.turnsByUser.get(session.sub) || [];
    const focus = this.focusByUser.get(session.sub) || {};

    const chunks: ContextChunk[] = [];
    if (Object.keys(focus).length) {
      chunks.push({ source: "session_cache", label: "current_focus", content: JSON.stringify(focus) });
    }
    for (const t of turns.slice().reverse()) {
      chunks.push({ source: "session_cache", label: "recent_turn", content: t.summary });
    }

    // trim to budget
    let used = 0;
    return chunks.filter((c) => (used += c.content.length) <= budgetChars);
  }
}

export const sessionCacheProvider = new SessionCacheProvider();
