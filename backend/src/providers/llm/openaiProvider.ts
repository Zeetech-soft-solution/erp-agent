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
        name: t.name,
        description: t.description,
        parameters: t.parameters || { type: "object", properties: {} },
      },
    }));

    const res = await axios.post(
      `${appConfig.llm.baseUrl}/chat/completions`,
      {
        model: appConfig.llm.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.tool_call_id ? { tool_call_id: m.tool_call_id, name: m.name } : {}),
        })),
        tools: toolSchemas,
      },
      { headers: { Authorization: `Bearer ${appConfig.llm.apiKey}` } }
    );

    const choice = res.data.choices[0].message;
    const toolCalls = (choice.tool_calls || []).map((tc: any) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: safeParse(tc.function.arguments),
    }));

    return { content: choice.content ?? null, tool_calls: toolCalls };
  }
}

function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}
