import "dotenv/config";
import express from "express";
import cors from "cors";
import { bootstrapModules } from "./bootstrap";
import { appConfig } from "./config/app.config";
import authRoutes from "./routes/auth.routes";
import toolsRoutes from "./routes/tools.routes";
import agentRoutes from "./routes/agent.routes";
import adminRoutes from "./routes/admin.routes";

bootstrapModules();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(appConfig.port, () => console.log(`ERP Agent backend running on :${appConfig.port}`));
