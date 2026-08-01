/** Mirrors backend core/types.ts AgentResponse — kept in sync manually
 *  for now; worth generating from a shared package once the API surface
 *  stabilizes (e.g. a small @erp-agent/contracts workspace package). */
export type AgentResponseType = "text" | "report" | "document" | "action_result";

export interface AgentResponse {
  type: AgentResponseType;
  message: string;
  data?: any;
  html?: string;
  document?: { name: string; url?: string; content?: string };
  interaction_id?: string;
  meta: {
    modules_used: string[];
    tools_used: string[];
    role_context: string[];
  };
}

export interface ChatTurn {
  id: string;
  prompt: string;
  response?: AgentResponse;
  pending?: boolean;
  isAlert?: boolean;
}

/** Mirrors backend core/types.ts Alert — a proactive notification (an
 *  ERPNext webhook today) pushed into chat outside the prompt/response
 *  flow. */
export interface Alert {
  id: string;
  entityKey: string;
  recordId: string;
  message: string;
  createdAt: string;
}
