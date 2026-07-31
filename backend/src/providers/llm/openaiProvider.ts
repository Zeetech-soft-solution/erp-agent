import { LLMProvider, LLMMessage, LLMResponse, ToolDefinition } from "../../core/types";
import { appConfig } from "../../config/app.config";
import axios from "axios";

/**
 * OpenAI-compatible chat-completions implementation of LLMProvider.
 * This is the ONLY file that knows about OpenAI's request/response
 * shape. Replacing it with your own hosted model later means writing
 * one new class implementing the same LLMProvider interface and
 * flipping LLM_PROVIDER in app.config — reasoningEngine.ts never changes.
 */
export class OpenAIProvider implements LLMProvider {
  async chat(messages: LLMMessage[], tools: ToolDefinition[]): Promise<LLMResponse> {
    const toolSchemas = tools.map((t) => ({
      type: "function",
      function: {
        name: toOpenAIName(t.name),
        description: t.description,
        parameters: t.parameters || { type: "object", properties: {} },
      },
    }));

    let res;
    try {
      res = await axios.post(
        `${appConfig.llm.baseUrl}/chat/completions`,
        {
          model: appConfig.llm.model,
          messages: messages.map((m) =>
            m.role === "assistant" && m.tool_calls?.length
              ? {
                  role: "assistant",
                  content: m.content || null,
                  tool_calls: m.tool_calls.map((tc) => ({
                    id: tc.id,
                    type: "function",
                    function: { name: toOpenAIName(tc.name), arguments: JSON.stringify(tc.arguments) },
                  })),
                }
              : {
                  role: m.role,
                  content: m.content,
                  ...(m.tool_call_id ? { tool_call_id: m.tool_call_id, name: toOpenAIName(m.name!) } : {}),
                }
          ),
          tools: toolSchemas,
        },
        { headers: { Authorization: `Bearer ${appConfig.llm.apiKey}` } }
      );
    } catch (err: any) {
      const message = err.response?.data?.error?.message || err.message;
      const wrapped = new Error(`LLM request failed: ${message}`);
      (wrapped as any).status = err.response?.status;
      throw wrapped;
    }

    const choice = res.data.choices[0].message;
    const toolCalls = (choice.tool_calls || []).map((tc: any) => ({
      id: tc.id,
      name: fromOpenAIName(tc.function.name),
      arguments: safeParse(tc.function.arguments),
    }));

    return { content: choice.content ?? null, tool_calls: toolCalls };
  }
}

/**
 * Our tool names are dot-namespaced (e.g. "crm.list_leads",
 * "stock.report.stock_balance") for readability across the codebase,
 * but OpenAI's function-calling API rejects any name not matching
 * ^[a-zA-Z0-9_-]+$ — no dots. "__" is a safe, reversible stand-in:
 * grep confirms no canonical tool name already contains it.
 */
function toOpenAIName(name: string) {
  return name.replace(/\./g, "__");
}

function fromOpenAIName(name: string) {
  return name.replace(/__/g, ".");
}

function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}
