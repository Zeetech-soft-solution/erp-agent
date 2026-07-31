import { useRef } from "react";
import { AgentResponse } from "../api/types";

/**
 * Renders the AgentResponse contract. "report" gets the server-rendered,
 * pre-sanitized HTML dropped in directly (the LLM never produced this
 * markup itself — see backend/core/rendererRegistry.ts). Next-step
 * buttons inside that HTML are wired via event delegation so clicking
 * one sends a new prompt, same as typing it.
 */
export function ResponseView({ response, onNextStep }: { response: AgentResponse; onNextStep: (text: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest(".erp-agent-next-step") as HTMLElement | null;
    if (target?.dataset.action) onNextStep(target.dataset.action);
  }

  return (
    <div className="bubble-agent">
      <div>{response.message}</div>

      {response.type === "report" && response.html && (
        <div className="agent-report-html" ref={ref} onClick={handleClick} dangerouslySetInnerHTML={{ __html: response.html }} />
      )}

      {response.type === "document" && response.document && (
        <div className="document-card">
          <span>{response.document.name}</span>
          {response.document.url && <a href={response.document.url}>Download</a>}
        </div>
      )}

      <div className="meta-row">
        {response.meta.tools_used.map((t) => (
          <span className="meta-chip" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
