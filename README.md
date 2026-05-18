# khovrov.dev portfolio

One-page recruiter-focused portfolio for an AI Automation Engineer, with interactive demos, admin logging, assistant prompt editing, and Docker deployment for `khovrov.dev`.

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

## Admin surfaces

- `/admin` - overview dashboard
- `/admin/assistant` - live assistant system prompt and public context editor
- `/admin/chat` - assistant request logs with model/status/latency
- `/admin/visits` - first-party public-site action logs
- `/admin/audits` - KB audit estimate logs
- `/admin/errors` - server/client error logs

## Demo project model

Each demo should grow into a public project without forcing the portfolio to become a monolith.

- Keep the portfolio-facing UI in `components/demos`.
- Keep portfolio API adapters in `app/api` only when the demo needs server-side keys, logging, or abuse controls.
- Build substantial demos as standalone public GitHub repositories with their own README, screenshots, and deployment.
- Connect a mature demo back into the portfolio as a card, embedded UI, or thin API adapter.
- Log recruiter interactions through `/api/site-actions` and keep raw secrets or private customer data out of public demos.

Current demo modules:

- Personal AI Assistant: `components/demos/demo-ai.tsx`, `app/api/chat/route.ts`, backed by Open WebUI through server-only env vars in production
- Knowledge Base Audit + RAG Builder: `components/demos/demo-kb.tsx`, `app/api/audit/route.ts`
- Conlang Word Generator + Audio Recognition: `components/demos/demo-conlang.tsx`

## Deployment

Deployment docs are in `ops/DEPLOYMENT.md`.

Before launch:

- Create `.env.production` on the VPS from `.env.production.example`.
- Add GitHub Actions secrets listed in `ops/DEPLOYMENT.md`.
- Point DNS records for `khovrov.dev`, `www.khovrov.dev`, and `stats.khovrov.dev` to the VPS.
- Add the finished CV as `public/cv.pdf`. That file is intentionally git-ignored.

Pushes to `main` deploy through GitHub Actions. The workflow preserves VPS-only env files, rebuilds the app image without Docker layer cache, runs migrations, and recreates the app/Caddy containers.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
```
