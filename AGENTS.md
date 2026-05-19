# Repository Handoff Notes

This file is for future Codex/AI sessions working on the portfolio.

## Current Architecture

- Public site: Next.js App Router, one-page portfolio at `https://khovrov.dev`.
- Admin panel: `/admin`, protected by a single admin session cookie.
- Database: Postgres in Docker Compose, migrations in `db/*.sql`.
- Deployment: GitHub Actions uploads source to `/var/www/khovrov.dev` and rebuilds Docker containers on the VPS.
- Reverse proxy: Caddy in this repo serves `khovrov.dev`, `www.khovrov.dev`, and `stats.khovrov.dev`.
- Open WebUI: separate project at `/opt/personal-voice-assistant`, served at `https://chat.khovrov.dev`.

## Assistant Integration

- Public UI: `components/demos/demo-ai.tsx`.
- Public API: `app/api/chat/route.ts`.
- Open WebUI adapter: `lib/assistant.ts`.
- Model allowlist: `lib/assistant-models.ts`.
- Editable prompt/context: `/admin/assistant`, backed by `assistant_config`.

The browser must never receive `OPENWEBUI_API_KEY`. Only `/api/chat` may call Open WebUI, and it must reject models outside the allowlist.

## Event and Audit Logging

- Public site actions are sent to `/api/site-actions`.
- `/api/events` is a compatibility alias.
- Events are stored in the `events` table and visible at `/admin/visits`.
- Chat transcripts are stored in `chat_requests` and visible at `/admin/chat`.
- Do not log raw IP addresses. Use the existing IP hash helper.

## Deployment Rules

- Pushes to `main` deploy production.
- The workflow cleans the VPS deploy directory before upload, preserving `.env.production`, `.env.production.*`, and `docker-data`.
- The workflow excludes real/local env files while keeping `.env.example`; do not overwrite VPS-only secrets.
- The app image is built with `--no-cache` to avoid stale Next.js standalone bundles.
- Migrations are append-only. Add a new numbered SQL file under `db/`.

Before pushing or deploying, explain the change and get explicit user approval.

## Useful Verification

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

Production smoke checks:

```powershell
Invoke-RestMethod https://khovrov.dev/api/chat -Method Post -ContentType 'application/json' -Body '{"message":"What public context are you allowed to use?","model":"~openai/gpt-mini-latest"}'
Invoke-WebRequest https://khovrov.dev/admin/assistant -MaximumRedirection 0
```

GitHub Actions should show one deploy run per push to `main`. Failed historical runs are useful audit/debug history and do not need cleanup. Investigate the latest failed run before changing production manually.

## Boundaries

- Keep demo project work in separate public repositories when it grows beyond a thin portfolio adapter.
- Keep `hifi/` as design reference unless the user explicitly asks to rework design source files.
- Keep `Context for AI.md` as source material, not final public copy.
- Do not commit `public/cv.pdf`, `.env*`, SSH keys, database dumps, or API keys.
