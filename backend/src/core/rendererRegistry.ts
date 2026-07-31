import { RendererFn, DisplayIntent } from "./types";
import { escapeHtml } from "../renderers/escape";

/**
 * Registry of "render kind" -> HTML builder. The LLM only ever chooses
 * a kind by NAME (table/chart/cards/...); it never emits HTML itself.
 * Add a new visual style by writing one renderer file and calling
 * register() — no changes anywhere else.
 */
class RendererRegistry {
  private renderers = new Map<string, RendererFn>();

  register(kind: string, fn: RendererFn) {
    this.renderers.set(kind, fn);
  }

  render(kind: string, data: any, intent: DisplayIntent): string {
    const fn = this.renderers.get(kind) || this.renderers.get("raw")!;
    try {
      return fn(data, intent);
    } catch {
      return this.renderers.get("raw")!(data, intent);
    }
  }
}

export const rendererRegistry = new RendererRegistry();

// Fallback that always works, even for shapes no specific renderer handles.
rendererRegistry.register("raw", (data) => `<pre class="erp-agent-raw">${escapeHtml(JSON.stringify(data, null, 2))}</pre>`);
