import { useState } from "react";
import { api } from "../api/client";
import { ChatTurn } from "../api/types";
import { ResponseView } from "../components/ResponseView";
import { DetailPanel } from "../components/DetailPanel";
import { Composer } from "../components/Composer";

/**
 * This is the core screen: login lands here. One component tree serves
 * both mobile and desktop — the detail panel simply doesn't render
 * (display: none) below 900px via CSS, rather than being a separate
 * code path. That's the "same site initializes mobile and desktop"
 * requirement from the brief.
 */
export function Chat() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);

  async function send(prompt: string) {
    const id = crypto.randomUUID();
    setTurns((prev) => [...prev, { id, prompt, pending: true }]);
    setSending(true);
    try {
      const response = await api.prompt(prompt);
      setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, response, pending: false } : t)));
    } catch (err: any) {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, pending: false, response: { type: "text", message: `Error: ${err.message}`, meta: { modules_used: [], tools_used: [], role_context: [] } } }
            : t
        )
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="agent-shell">
      <header className="agent-header">
        <div className="brand">ERP <span>Agent</span></div>
        <button
          onClick={async () => { await api.logout().catch(() => {}); api.clearToken(); window.location.href = "/login"; }}
          style={{ background: "none", border: "none", color: "var(--ink-secondary)", fontSize: 12, cursor: "pointer" }}
        >
          Sign out
        </button>
      </header>

      <div className="agent-body">
        <div className="chat-column">
          <div className="message-list">
            {!turns.length && (
              <div className="bubble-agent">
                Ask me about leads, opportunities, orders, or anything else your role has access to.
              </div>
            )}
            {turns.map((t) => (
              <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="turn self-end">
                  <div className="bubble-user">{t.prompt}</div>
                </div>
                <div className="turn">
                  {t.pending ? (
                    <div className="bubble-agent pending">Thinking…</div>
                  ) : (
                    t.response && <ResponseView response={t.response} onNextStep={send} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <Composer onSend={send} disabled={sending} />
        </div>

        <DetailPanel />
      </div>
    </div>
  );
}
