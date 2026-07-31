import { Router } from "express";
import { requireAuth, AuthedRequest } from "../auth/middleware";
import { callTool, listAllowedTools } from "../core/gateway";

/**
 * GENERIC structured API surface — replaces per-module route files.
 * Any tool any module registers is automatically reachable here, so
 * the frontend's table/report views can call a known tool directly
 * without a new backend route being written for every module.
 */
const router = Router();
router.use(requireAuth);

router.get("/", (req: AuthedRequest, res) => {
  const tools = listAllowedTools(req.session!);
  res.json({ tools: tools.map((t) => ({ name: t.name, description: t.description, module: t.module })) });
});

router.post("/:toolName", async (req: AuthedRequest, res) => {
  try {
    const data = await callTool(req.session!, req.params.toolName, req.body || {});
    res.json({ data });
  } catch (err: any) {
    res.status(err.name === "ToolNotAllowedError" ? 403 : 400).json({ error: err.message });
  }
});

export default router;
