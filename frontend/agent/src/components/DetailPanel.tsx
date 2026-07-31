import { useEffect, useState } from "react";
import { api } from "../api/client";

interface Capability { name: string; description: string; }

/**
 * Desktop-only panel (hidden below 900px via CSS, see styles.css) —
 * this is the "more visibility, more features" desktop surface
 * discussed: shows exactly what this role's session can currently do.
 */
export function DetailPanel() {
  const [caps, setCaps] = useState<Capability[]>([]);

  useEffect(() => {
    api.capabilities().then((r) => setCaps(r.tools)).catch(() => {});
  }, []);

  return (
    <aside className="detail-panel">
      <h3>What I can help with</h3>
      {caps.map((c) => (
        <div className="cap-item" key={c.name} title={c.description}>{c.name}</div>
      ))}
      {!caps.length && <div className="cap-item">Loading…</div>}
    </aside>
  );
}
