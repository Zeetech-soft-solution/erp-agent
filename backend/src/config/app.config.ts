import "dotenv/config";

/**
 * Central switchboard. Enabling/disabling a module or swapping a
 * provider is an env var change, not a code change — bootstrap.ts
 * reads this file to decide what to wire up.
 */
export const appConfig = {
  port: Number(process.env.PORT || 4000),

  // Comma-separated module names to load. Add a new module dir under
  // src/modules/, then add its name here (or via env) — nothing else
  // needs to change.
  activeModules: (process.env.ACTIVE_MODULES || "crm,context,tickets,email").split(","),

  // Roles allowed into the admin interface — separate trust boundary
  // from allowed_tools (agent tool permissions). Not tool-gated because
  // settings CRUD is never something the LLM itself calls.
  adminRoles: (process.env.ADMIN_ROLES || "System Manager").split(","),

  security: {
    // 32-byte, base64-encoded key for encrypting stored user credentials
    // at rest (core/credentialVault.ts). Generate with:
    //   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    credentialEncryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY || "",
  },

  // Which SystemConnector implementation config/system.config.ts
  // instantiates. "erpnext" today; any other business backend
  // (SAP, a healthcare EMR, a banking core, a logistics TMS...)
  // tomorrow — this is a business-system switch, not an "ERP" switch.
  system: {
    provider: process.env.SYSTEM_PROVIDER || "erpnext",
  },

  erpnext: {
    baseUrl: process.env.ERPNEXT_BASE_URL || "",
    apiKey: process.env.ERPNEXT_API_KEY || "",
    apiSecret: process.env.ERPNEXT_API_SECRET || "",
  },

  jwt: {
    secret: process.env.AGENT_JWT_SECRET || "dev-secret-change-me",
    expiresIn: process.env.AGENT_JWT_EXPIRES_IN || "8h",
  },

  llm: {
    provider: process.env.LLM_PROVIDER || "openai", // swap key -> swap provider in bootstrap.ts
    apiKey: process.env.LLM_API_KEY || "",
    baseUrl: process.env.LLM_BASE_URL || "https://api.openai.com/v1",
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    maxToolIterations: Number(process.env.LLM_MAX_TOOL_ITERATIONS || 5),
  },

  context: {
    sessionCacheTurns: Number(process.env.CONTEXT_SESSION_TURNS || 6),
    vectorTopK: Number(process.env.CONTEXT_VECTOR_TOPK || 5),
    totalBudgetChars: Number(process.env.CONTEXT_BUDGET_CHARS || 6000),
  },

  db: {
    postgresUrl: process.env.DATABASE_URL || "",
  },
};
