# ERP Agent (Free / Open Core)

An extensible, role-based AI agent for ERP systems. This is the **free, open-source tier**:
the complete core engine (module registry, entity/workflow/report factories, auth, context
assembly, LLM tool-calling loop) plus a working reference connector for ERPNext, wired up
with a small demo slice of each standard ERP module (CRM, Selling, Buying, Stock,
Accounting, HR, Manufacturing, Projects) so the full architecture is visible end to end.

## What's here vs. what's not

Every module you see under `backend/src/config/modules/` and
`backend/src/erpnext/entityMaps/` is real and functional, but deliberately shallow — a
couple of entities per module (e.g. `customer`, `opportunity` for CRM), not the full
ERPNext doctype surface. The point of this repo is the **pattern**: how core stays
100% ERP-agnostic, and how a new module or a new connector (SAP, another ERP) plugs in
without touching existing code (see `docs/ARCHITECTURE.md`).

A private, paid tier built on this same core expands every module to full ERPNext
doctype/API coverage and adds additional connectors. It is not part of this repository.

## License

AGPL-3.0 (see `LICENSE`). If you run a modified version of this code as a network
service, you must make your modified source available to your users under the same
license.

## Structure

```
backend/    Node/TypeScript API server (core engine, config, connectors, routes)
frontend/
  admin/    Admin console (Vite + React)
  agent/    End-user chat/agent UI (Vite + React)
docs/       Architecture, testing guide, training plan
```

## Getting started

```bash
cd backend && npm install && cp .env.example .env && npm run dev
cd frontend/admin && npm install && cp .env.example .env && npm run dev
cd frontend/agent && npm install && cp .env.example .env && npm run dev
```

See `docs/ARCHITECTURE.md` for how modules, entities, and connectors fit together, and
`docs/TESTING_GUIDE.md` for how to exercise the running system.
