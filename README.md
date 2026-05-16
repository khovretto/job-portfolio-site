# khovrov.dev portfolio

One-page recruiter-focused portfolio for an AI Automation Engineer, with simulated interactive demos, admin logging, and Docker deployment for `khovrov.dev`.

## Local development

```powershell
npm install
npm run dev
```

Public pages and demos work without Postgres. Database writes are best-effort in local development.

The admin panel requires `DATABASE_URL`, migrated tables, and an admin user:

```powershell
copy .env.example .env.local
npm run db:migrate
npm run db:init-admin
```

## Demo project model

Each demo should grow into a public project without forcing the portfolio to become a monolith.

- Keep the portfolio-facing UI in `components/demos`.
- Keep portfolio API adapters in `app/api` only when the demo needs server-side keys, logging, or abuse controls.
- Build substantial demos as standalone public GitHub repositories with their own README, screenshots, and deployment.
- Connect a mature demo back into the portfolio as a card, embedded UI, or thin API adapter.
- Log recruiter interactions through `/api/events` and keep raw secrets or private customer data out of public demos.

Current demo modules:

- Personal AI Assistant: `components/demos/demo-ai.tsx`, `app/api/chat/route.ts`, optionally backed by Open WebUI through server-only env vars
- Knowledge Base Audit + RAG Builder: `components/demos/demo-kb.tsx`, `app/api/audit/route.ts`
- Conlang Word Generator + Audio Recognition: `components/demos/demo-conlang.tsx`

## Deployment

Deployment docs are in `ops/DEPLOYMENT.md`.

Before launch:

- Create `.env.production` on the VPS from `.env.production.example`.
- Add GitHub Actions secrets listed in `ops/DEPLOYMENT.md`.
- Point DNS records for `khovrov.dev`, `www.khovrov.dev`, and `stats.khovrov.dev` to the VPS.
- Add the finished CV as `public/cv.pdf`. That file is intentionally git-ignored.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
```
