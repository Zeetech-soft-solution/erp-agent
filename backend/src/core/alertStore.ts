import { Alert } from "./types";

/**
 * In-memory queue of pending Alerts per user email, drained by polling
 * (GET /api/agent/alerts). Same shape and same caveat as
 * core/sessionStore.ts: fine for a single backend instance today, swap
 * for Redis (or any list-per-key store) the moment there's more than
 * one process, since alerts pushed on one instance must be visible to
 * a poll served by another.
 *
 * Alerts are keyed by user email rather than sessionId — a webhook
 * only knows who a record's owner is, not which of their sessionIds
 * (if any) are currently open, and a user may be signed in on more
 * than one device. Delivery drains the whole queue at once: if two
 * devices are open, only whichever one polls first gets it — an
 * accepted limitation for now rather than building per-device ack
 * tracking.
 */
class AlertStore {
  private queues = new Map<string, Alert[]>();

  push(userEmail: string, alert: Alert) {
    const queue = this.queues.get(userEmail) || [];
    queue.push(alert);
    this.queues.set(userEmail, queue);
  }

  drain(userEmail: string): Alert[] {
    const queue = this.queues.get(userEmail) || [];
    this.queues.delete(userEmail);
    return queue;
  }
}

export const alertStore = new AlertStore();
