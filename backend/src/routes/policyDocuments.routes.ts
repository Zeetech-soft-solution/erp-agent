import { Router } from "express";
import multer from "multer";
import mammoth from "mammoth";
import { requireAuth, AuthedRequest } from "../auth/middleware";
import { requireAdmin } from "../auth/adminMiddleware";
import { asyncHandler } from "../core/asyncHandler";
import { PolicyDocumentStore } from "../core/policyDocumentStore";
import { embedder } from "../bootstrap";

const store = new PolicyDocumentStore(embedder);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/", asyncHandler(async (_req, res) => {
  res.json({ documents: await store.list() });
}));

/**
 * Admin uploads a .docx as the initial version of a policy/reference
 * document (business policy, workflow rules, ...). Text is extracted
 * with mammoth, chunked, and embedded into context_embeddings so it
 * surfaces as normal WARM context on future prompts — see
 * core/policyDocumentStore.ts. Editing afterward (PUT /:id) never
 * requires re-uploading a file.
 */
router.post("/", upload.single("file"), asyncHandler(async (req: AuthedRequest, res) => {
  if (!req.file) return res.status(400).json({ error: "file is required (.docx)" });
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });

  const { value: text } = await mammoth.extractRawText({ buffer: req.file.buffer });
  if (!text.trim()) return res.status(400).json({ error: "No text could be extracted from this document" });

  const doc = await store.create({
    title,
    module: req.body.module || null,
    filename: req.file.originalname,
    text,
    uploadedBy: req.session!.sub,
  });
  res.status(201).json({ document: doc });
}));

router.put("/:id", asyncHandler(async (req: AuthedRequest, res) => {
  const { title, module, text } = req.body;
  const doc = await store.update(req.params.id, { title, module, text });
  if (!doc) return res.status(404).json({ error: "Policy document not found" });
  res.json({ document: doc });
}));

router.put("/:id/active", asyncHandler(async (req: AuthedRequest, res) => {
  if (typeof req.body.active !== "boolean") return res.status(400).json({ error: "active must be boolean" });
  const ok = await store.setActive(req.params.id, req.body.active);
  if (!ok) return res.status(404).json({ error: "Policy document not found" });
  res.json({ ok: true });
}));

router.delete("/:id", asyncHandler(async (req: AuthedRequest, res) => {
  const ok = await store.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: "Policy document not found" });
  res.json({ ok: true });
}));

export default router;
