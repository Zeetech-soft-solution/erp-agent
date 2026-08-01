import { Router } from "express";
import { requireAuth, AuthedRequest } from "../auth/middleware";
import { ReasoningEngine } from "../core/reasoningEngine";
import { ContextAssembler } from "../core/contextAssembler";
import { sessionCacheProvider } from "../providers/context/sessionCacheProvider";
import { vectorContextProvider } from "../providers/context/vectorContextProvider";
import { OpenAIProvider } from "../providers/llm/openaiProvider";
import { PostgresInteractionLogger } from "../core/interactionLogger";
import { listAllowedTools } from "../core/gateway";
import { asyncHandler } from "../core/asyncHandler";
import { alertStore } from "../core/alertStore";

const interactionLogger = new PostgresInteractionLogger();
const engine = new ReasoningEngine(
  new OpenAIProvider(),
  new ContextAssembler([sessionCacheProvider, vectorContextProvider]),
  interactionLogger
);

const router = Router();
router.use(requireAuth);

router.post("/prompt", asyncHandler(async (req: AuthedRequest, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });
  const response = await engine.run(req.session!, prompt);
  sessionCacheProvider.addTurn(req.session!.sub, { prompt, summary: response.message.slice(0, 300) });
  res.json(response);
}));

router.post("/feedback/:interactionId", asyncHandler(async (req: AuthedRequest, res) => {
  const { feedback } = req.body;
  if (feedback !== 1 && feedback !== -1 && feedback !== null) {
    return res.status(400).json({ error: "feedback must be 1, -1, or null" });
  }
  const ok = await interactionLogger.setFeedback(req.params.interactionId, req.session!.sub, feedback);
  if (!ok) return res.status(404).json({ error: "Interaction not found" });
  res.json({ ok: true });
}));

router.get("/alerts", (req: AuthedRequest, res) => {
  res.json({ alerts: alertStore.drain(req.session!.sub) });
});

router.get("/capabilities", (req: AuthedRequest, res) => {
  const tools = listAllowedTools(req.session!);
  res.json({ role_context: req.session!.erpnext_roles, tools: tools.map((t) => ({ name: t.name, description: t.description })) });
});

export default router;
