import { useEffect, useState } from "react";
import { api } from "../api/client";
import { StatusStrip } from "../components/StatusStrip";

interface Setting {
  key: string;
  value: any;
  label: string;
  description: string | null;
  value_type: "string" | "number" | "boolean";
}

export function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  function load() {
    api.getSettings().then((r) => setSettings(r.settings)).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  function draftFor(s: Setting) {
    return s.key in drafts ? drafts[s.key] : s.value;
  }

  async function save(s: Setting) {
    setSavingKey(s.key);
    setError("");
    try {
      const raw = draftFor(s);
      const value = s.value_type === "number" ? Number(raw) : s.value_type === "boolean" ? Boolean(raw) : raw;
      await api.updateSetting(s.key, value);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="main">
      <h1 className="page-title">Global settings</h1>
      <p className="page-subtitle">
        Operational parameters the agent reads live. Secrets (API keys, database URL) stay in the
        server's .env file and aren't editable here.
      </p>

      <StatusStrip />

      <div className="card">
        {settings.map((s) => (
          <div className="card-row" key={s.key}>
            <div>
              <p className="setting-label">{s.label}</p>
              {s.description && <p className="setting-desc">{s.description}</p>}
              <p className="setting-key">{s.key}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {s.value_type === "boolean" ? (
                <select
                  className="setting-input"
                  value={String(draftFor(s))}
                  onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value === "true" })}
                >
                  <option value="true">On</option>
                  <option value="false">Off</option>
                </select>
              ) : (
                <input
                  className="setting-input"
                  type={s.value_type === "number" ? "number" : "text"}
                  value={draftFor(s)}
                  onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })}
                />
              )}
              <button className="save-btn" disabled={savingKey === s.key} onClick={() => save(s)}>
                {savingKey === s.key ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ))}
        {!settings.length && !error && <p className="setting-desc">Loading settings…</p>}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
