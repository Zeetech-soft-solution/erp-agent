# Testing Guide — step by step

Follow in order. Each phase assumes the previous one passed. Where a
curl command is given, run it before trusting the UI — if the API
doesn't return what you expect, the UI won't either, and curl tells
you exactly which layer is broken.

---

## Phase 0 — Prerequisites checklist

- [ ] ERPNext is reachable at some URL you can open in a browser
- [ ] You can log into that ERPNext as an admin
- [ ] Node.js 18+ and npm installed locally
- [ ] Postgres 14+ available (local install, Docker, or managed) with
      permission to run `CREATE EXTENSION vector;`
- [ ] An OpenAI API key (or another OpenAI-compatible endpoint + key)

---

## Phase 1 — ERPNext setup

1. Log into ERPNext as admin.
2. Go to your user profile (top-right) → **API Access** → **Generate Keys**.
   Copy the **API Key** and **API Secret** immediately — the secret is
   shown once only.
3. Create two test users (Users list → New):
   - `sales.user@test.com` — assign role **Sales User**
   - `sales.manager@test.com` — assign role **Sales Manager**
   - (optional) a third with **System Manager** for admin testing
4. Create at least 2-3 test **Lead** records manually in ERPNext, with
   different `status` values (e.g. one "Open", one "Interested") — you
   need real data to see the agent actually return something.

**Checkpoint**: note down `ERPNEXT_BASE_URL`, `ERPNEXT_API_KEY`,
`ERPNEXT_API_SECRET`, and both test user passwords. You'll need all of
these in the next steps.

---

## Phase 2 — Database

```bash
createdb erp_agent
psql erp_agent -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

If `CREATE EXTENSION vector` fails, your Postgres doesn't have pgvector
installed at the OS level — install it first (`apt install postgresql-16-pgvector`
or equivalent for your distro/version), then retry.

```bash
cd backend
psql erp_agent -f src/db/migrations/001_init.sql
psql erp_agent -f src/db/migrations/002_settings.sql
psql erp_agent -f src/db/migrations/003_user_credentials.sql
```

**Checkpoint**:
```bash
psql erp_agent -c "\dt"
```
should list `context_embeddings`, `interaction_log`, `settings`, `admin_audit_log`.

---

## Phase 3 — Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
ERPNEXT_BASE_URL=<your real URL>
ERPNEXT_API_KEY=<from Phase 1>
ERPNEXT_API_SECRET=<from Phase 1>
DATABASE_URL=postgres://<user>:<pass>@localhost:5432/erp_agent
AGENT_JWT_SECRET=<any long random string>
LLM_API_KEY=<your OpenAI key>
ADMIN_ROLES=System Manager
```

```bash
npm run dev
```

**Checkpoint** — console should print:
```
[bootstrap] Loaded modules: crm, context, tickets, email, item, sales_order, purchase_order, employee, sales_invoice, lead_qualification
ERP Agent backend running on :4000
```
If a module is missing from that list, check `ACTIVE_MODULES` in `.env`.

### 3a. Health check
```bash
curl http://localhost:4000/health
```
Expect `{"ok":true}`. If this fails, the server isn't running — check the terminal for errors first.

### 3b. Login (this is the real ERPNext connectivity test)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sales.user@test.com","password":"<their password>"}'
```
Expect a JSON body with `token`, `roles: ["Sales User"]`, and an
`allowed_tools` array. **If this fails**, the problem is
`ERPNEXT_BASE_URL`/`API_KEY`/`API_SECRET` or the user's own password —
not the agent code. Save the `token` value, you need it for every
request below.

```bash
export TOKEN="<paste token here>"
```

**Alternative — API key login** (no password sent to the agent at all):
in ERPNext, go to `sales.user@test.com`'s profile → API Access →
Generate Keys, then:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sales.user@test.com","apiKey":"<key>","apiSecret":"<secret>"}'
```
Should return the same shape as password login.

**Impersonation check** — this is the part worth actually verifying,
not just trusting: after calling `crm.create_lead` (step 3d/3e area)
as `sales.user@test.com`, open that Lead in the ERPNext desk UI and
check its **Owner** field. It should show `sales.user@test.com`, NOT
your service account / Administrator. If it shows the service
account, impersonation isn't working and every action will
misattribute in ERPNext's own audit trail — flag this immediately,
it's the core guarantee this whole auth design exists for.


### 3c. List tools this role can see
```bash
curl http://localhost:4000/api/tools -H "Authorization: Bearer $TOKEN"
```
Sales User should see `crm.list_leads`, `crm.get_lead`, `crm.create_lead`,
`crm.list_opportunities`, `context.search`, `lead_qualification.qualify`,
`lead_qualification.disqualify` — and nothing else (no `crm.create_opportunity`,
no `tickets.*`, no `sales_order.*`).

### 3d. Call a real ERPNext-backed tool
```bash
curl -X POST http://localhost:4000/api/tools/crm.list_leads \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}'
```
Expect your real ERPNext leads back, with canonical field names
(`id`, `display_name`, `email`, `phone`, `status` — not ERPNext's raw
`name`/`lead_name`). **This is the actual end-to-end proof** that
connector → entity map → ERPNext REST API all work.

### 3e. Try a tool this role should NOT have
```bash
curl -X POST http://localhost:4000/api/tools/crm.create_opportunity \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}'
```
Expect `403` with a "not permitted" error. If a Sales User can call
this, the role gate is broken — stop and flag it before testing anything else.

### 3f. Workflow — the double-gate test
```bash
# Get a real lead id from step 3d's response, use it below
curl -X POST http://localhost:4000/api/tools/lead_qualification.qualify \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"entity_id":"<a real lead id>"}'
```
Expect the lead's status to move to "Interested" (check in ERPNext directly to confirm).

Now try converting as the same Sales User:
```bash
curl -X POST http://localhost:4000/api/tools/lead_qualification.convert \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"entity_id":"<same lead id>"}'
```
Expect `403` (tool not in Sales User's `allowed_tools` at all).

Log in as `sales.manager@test.com`, get a new token, retry `.convert` —
expect success this time. **This proves the role policy AND the
workflow's transition-level gate are both working.**

### 3g. Multi-module coverage + a report tool

```bash
curl http://localhost:4000/api/tools -H "Authorization: Bearer $TOKEN"
```
As `sales.user@test.com` you should now also see `quotation.list`,
`sales_order.list`, `sales_invoice.list` (the Selling module). Log in
as `sales.manager@test.com` and confirm those plus the CRM tools.

```bash
# As a Purchasing User (create one in ERPNext with that role if you haven't)
curl -X POST http://localhost:4000/api/tools/stock.report.stock_balance \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{}'
```
Expect an array of stock balance rows. **If ERPNext returns an error
about the report name or filters**, that's expected until you verify
`erpnext/reportMap.ts`'s `reportName`/`filterFieldMap` against your
actual ERPNext version — report internals vary more than doctype REST
endpoints do. Fix it in that one file; nothing else needs to change.

### 3h. The reasoning loop (needs a real LLM key)
```bash
curl -X POST http://localhost:4000/api/agent/prompt \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"prompt":"list my leads"}'
```
Expect `{"type":"report", "message":"...", "data":[...], "html":"<div class=\"erp-agent-report\">...", "meta":{...}}`.

If this errors, check the backend console — most likely cause is a bad
`LLM_API_KEY` or a network/firewall block on `api.openai.com`.

---

## Phase 4 — Admin app

```bash
cd ../frontend/admin
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:5173`.

- [ ] Log in as your `System Manager` test user
- [ ] Confirm the module-status strip shows the same module list as the backend console
- [ ] Edit a setting (e.g. `context_budget_chars`), save, refresh the page — value should persist
- [ ] Log in as `sales.user@test.com` instead — expect a `403`/redirect, since Sales User isn't in `ADMIN_ROLES`

### 4a. Provision a persistent credential (the impersonation test that matters most)

- [ ] Back in ERPNext, go to `sales.user@test.com`'s own profile → API Access → Generate Keys
- [ ] In the admin app, go to **User credentials**, enter that email + the key/secret you just generated, save
      — expect success (it validates against ERPNext before storing)
- [ ] Try saving a key that does NOT belong to that email — expect a rejected save with a clear error,
      not a silent wrong-identity attachment
- [ ] Log out of the agent app (if signed in as `sales.user@test.com`) and log back in with password —
      create a new lead — check its **Owner** field in ERPNext: should still be `sales.user@test.com`,
      now via the stored credential instead of a live session
- [ ] Revoke the credential from the admin app — confirm any existing agent-app session for that user
      is logged out (try a request with the old token — expect 401)

---

## Phase 5 — Agent app

```bash
cd ../frontend/agent
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:5174`.

- [ ] Log in as `sales.user@test.com`
- [ ] Send: "list my leads" — should render as a table matching curl step 3d
- [ ] Resize the browser past 900px wide — capabilities panel should appear on the right
- [ ] Send: "create an opportunity for Acme Corp" — should fail gracefully (role doesn't have this tool) rather than crashing
- [ ] Log out, log in as `sales.manager@test.com` — send the same prompt — should succeed this time

---

## Phase 6 — Known gaps (expected, not bugs)

- `context.search` / prompts that would use semantic search return empty — no embedder wired yet
- `tickets.list`, `email.list`, `email.draft` return placeholder text — external MCPs not connected yet
- No automated test suite exists yet — everything above is manual verification

---

## If something breaks

Report back with: which phase/step, the exact command or action, and
the exact error message or response body — that's enough for me to
find the fix without guessing.
