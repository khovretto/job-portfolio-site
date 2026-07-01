# VPS Context for Demo Projects

Collected: 2026-06-26  
Primary host: `khovrov.dev` / `145.223.117.188`  
SSH user used by Codex: `deploy`  
Deploy path for the portfolio repo: `/var/www/khovrov.dev`

This document is for future AI/Codex sessions working on demo projects that may be deployed alongside the portfolio site.

## Current VPS Snapshot

The VPS is a Hostinger Ubuntu Docker host.

Observed runtime state:

| Area | Value |
| --- | --- |
| Hostname | `srv1660633` |
| OS | Ubuntu 24.04.4 LTS (`noble`) |
| Kernel | `6.8.0-111-generic` |
| CPU | 2 vCPU, AMD EPYC 9354P |
| RAM | 7.8 GiB total, about 4.5 GiB available during inspection |
| Swap | 2.0 GiB total, about 2.0 GiB used during inspection |
| Disk | 96 GiB root volume, 75 GiB used, 21 GiB free, 79% used |
| Docker | Docker 29.4.3, Docker Compose v5.1.3 |
| Uptime at inspection | 46 days |

Capacity notes:

- Treat this as a small VPS. It can host portfolio demos, but a heavier demo needs explicit resource limits and a rollback plan.
- Swap was essentially full during inspection. Avoid memory-spiky workloads without limits.
- Docker reported about `64.58GB` of images and `57.22GB` of build cache, with `51.35GB` reclaimable. Do not prune automatically; ask the user first because cleanup is irreversible enough to require approval.
- Most containers have no Docker CPU or memory limits. The only observed limited container was `open-terminal` with `2GiB` memory and `1.5` CPUs.

## Public DNS and Routes

These names resolved to `145.223.117.188` during inspection:

- `khovrov.dev`
- `www.khovrov.dev`
- `stats.khovrov.dev`
- `chat.khovrov.dev`
- `kb-audit.khovrov.dev`
- `automation.khovrov.dev`

Observed HTTP status checks:

| URL | Status |
| --- | --- |
| `https://khovrov.dev/` | `200` |
| `https://stats.khovrov.dev/` | `200` |
| `https://chat.khovrov.dev/` | `200` |
| `https://kb-audit.khovrov.dev/` | `200` |
| `https://automation.khovrov.dev/` | `401` because the root UI is behind Caddy basic auth |

Caddy in this repository owns the public reverse proxy routes. Do not create VPS-only public routes by hand unless the user explicitly asks for temporary/manual state.

Tracked routes live in:

```text
ops/caddy/Caddyfile
```

Current route intent:

| Host | Upstream |
| --- | --- |
| `khovrov.dev` | `app:3000` |
| `www.khovrov.dev` | redirect to `khovrov.dev` |
| `stats.khovrov.dev` | `umami:3000` |
| `chat.khovrov.dev` | Open WebUI at `openwebui:8080`, plus `/toolservers/mnemosyne-public/*` to `mnemosyne-broker-api-public:8765` |
| `kb-audit.khovrov.dev` | `kb-rag-auditor-app:3000`, with Caddy basic auth on admin paths |
| `automation.khovrov.dev` | `khovrov-n8n:5678`, webhooks public and other paths protected by Caddy basic auth |

## Running Docker Workloads

All observed project containers are attached to the shared Docker network:

```text
khovrovdev_default
```

Observed running containers:

| Container | Compose project | Service | Notes |
| --- | --- | --- | --- |
| `khovrovdev-caddy-1` | `khovrovdev` | `caddy` | Public ports `80` and `443` |
| `khovrovdev-app-1` | `khovrovdev` | `app` | Next.js portfolio |
| `khovrovdev-postgres-1` | `khovrovdev` | `postgres` | Shared Postgres for portfolio and Umami |
| `khovrovdev-umami-1` | `khovrovdev` | `umami` | Analytics |
| `open-webui-open-webui-1` | `open-webui` | `open-webui` | Private assistant UI at `chat.khovrov.dev` |
| `open-terminal` | `open-webui` | `open-terminal` | Resource-limited helper container |
| `khovrov-n8n` | `khovrov-n8n` | `n8n` | Automation subdomain |
| `kb-rag-auditor-app` | `kb-rag-auditor` | `kb-rag-auditor-app` | KB audit demo |
| `qdrant-qdrant-1` | `qdrant` | `qdrant` | Bound to `127.0.0.1:6333` on host, reachable as `qdrant` inside shared Docker network |
| `mnemosyne-broker-api` | `broker-api` | `broker-api` | Internal broker |
| `mnemosyne-broker-api-public` | `broker-api` | `broker-api-public` | Routed under `chat.khovrov.dev/toolservers/mnemosyne-public/*` |

Name resolution from the Caddy container works for:

```text
app
umami
openwebui
kb-rag-auditor-app
khovrov-n8n
mnemosyne-broker-api-public
qdrant
```

## Existing Project Locations

Observed top-level project directories:

```text
/var/www/khovrov.dev
/opt/kb-rag-auditor
/opt/khovrov-n8n
/opt/mnemosyne
/opt/personal-voice-assistant
/opt/qdrant
```

Observed Compose files:

```text
/var/www/khovrov.dev/docker-compose.yml
/opt/kb-rag-auditor/docker-compose.yml
/opt/khovrov-n8n/docker-compose.yml
/opt/qdrant/docker-compose.yml
```

The portfolio repo deploys to `/var/www/khovrov.dev`. Substantial demos should usually live in their own repo/folder, commonly under `/opt/<project-name>`, and only expose their public route through this portfolio repo's Caddy config.

## Security Baseline

Observed host posture:

- SSH key login is used.
- SSH root login is disabled by bootstrap policy.
- Password SSH is disabled by bootstrap policy.
- `deploy` is in the Docker group and has passwordless sudo. Treat the `deploy` SSH key as root-equivalent.
- UFW is active.
- Allowed inbound ports: `22`, `80`, `443`.
- Default UFW incoming policy: deny.
- `fail2ban` is running with jails:
  - `sshd`
  - `caddy-mnemosyne`

Do not print or copy secret values into chat or repository files. During inspection, only environment variable names were listed from `/var/www/khovrov.dev/.env.production`.

Important production env keys present on the VPS include:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
ASSISTANT_ALLOWED_MODELS
ASSISTANT_DEFAULT_MODEL
CADDY_AUTOMATION_ADMIN_HASH
CADDY_CHAT_ADMIN_HASH
CADDY_KB_AUDIT_ADMIN_HASH
CADDY_OISZ_EDITOR_ADMIN_HASH
IP_HASH_SECRET
MNM_BROKER_TOKEN
MNM_BROKER_URL
NEXT_PUBLIC_SITE_URL
OPENWEBUI_API_KEY
OPENWEBUI_BASE_URL
POSTGRES_PASSWORD
POSTGRES_USER
SESSION_SECRET
UMAMI_APP_SECRET
UMAMI_WEBSITE_ID
```

Real secrets and Caddy basic-auth hashes belong only on the VPS, normally in:

```text
/var/www/khovrov.dev/.env.production
```

## How Portfolio Deployment Works

Production deployment is GitHub Actions driven.

Workflow:

```text
.github/workflows/deploy.yml
```

Triggers:

- Push to `main`
- Manual `workflow_dispatch`

Deployment behavior:

1. Install dependencies with `npm ci`.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. SSH to the VPS as `deploy`.
5. Clean `/var/www/khovrov.dev`, preserving `.env.production`, `.env.production.*`, and `docker-data`.
6. Upload repo source, excluding `.git`, `node_modules`, `.next`, `docker-data`, and real/local env files.
7. Start Postgres if needed.
8. Validate Caddy config.
9. Rebuild the app image with `--no-cache`.
10. Run migrations and admin initialization.
11. Force-recreate app and Caddy containers.
12. Start Umami.
13. Smoke test the public site, Open WebUI route, and `/api/site-actions`.

Deployment commands run on the VPS from `/var/www/khovrov.dev`:

```bash
docker compose --env-file .env.production up -d --build postgres
docker compose --env-file .env.production run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
docker compose --env-file .env.production build --no-cache app
docker compose --env-file .env.production run --rm app npm run db:migrate
docker compose --env-file .env.production run --rm app npm run db:init-admin
docker compose --env-file .env.production up -d --force-recreate --no-deps app
docker compose --env-file .env.production up -d --force-recreate --no-deps caddy
docker compose --env-file .env.production up -d --no-deps umami
docker compose --env-file .env.production ps
docker image prune -f
```

Before pushing or deploying, Codex must explain the change and wait for explicit user approval.

## Pattern for a New Demo Project

Recommended pattern for heavier demos:

1. Keep substantial demo source in a separate repo/folder, not inside the portfolio monolith.
2. Deploy that app as its own Docker Compose project under `/opt/<demo-name>`.
3. Attach the app service to the existing external network `khovrovdev_default`.
4. Give the service a stable DNS name through the service name or explicit network alias.
5. Add the public subdomain route in this repo's `ops/caddy/Caddyfile`.
6. Add placeholder env variable names to `.env.example` if Caddy basic auth or route-specific config is needed.
7. Put real hashes/secrets only in `/var/www/khovrov.dev/.env.production`.
8. Push the Caddy route change to `main` only after explicit approval.

Example independent demo Compose skeleton:

```yaml
services:
  demo-app:
    image: ghcr.io/owner/demo-app:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
    networks:
      khovrovdev_default:
        aliases:
          - demo-app
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1024M

networks:
  khovrovdev_default:
    external: true
```

Example Caddy route in this repo:

```caddyfile
demo.khovrov.dev {
  encode zstd gzip
  reverse_proxy demo-app:3000
}
```

Protected route pattern:

```caddyfile
demo.khovrov.dev {
  encode zstd gzip

  basic_auth {
    admin {$CADDY_DEMO_ADMIN_HASH}
  }

  reverse_proxy demo-app:3000
}
```

## Heavy Demo Guidance

Use these defaults unless the user has a stronger reason:

- Prefer a separate Compose project under `/opt/<demo-name>`.
- Put long-running or expensive jobs behind a queue or explicit admin action.
- Add memory and CPU limits before exposing the demo publicly.
- Add request rate limits in the app or at Caddy if the endpoint can trigger expensive work.
- Avoid writing large artifacts into the portfolio deploy directory.
- Use a named Docker volume for persistent data and document how to back it up.
- If the demo needs Postgres, prefer a separate database or separate container unless the integration is intentionally small.
- If the demo needs vector search, check whether existing Qdrant is appropriate before adding another vector database.
- If the demo downloads models, caches embeddings, or builds large images, check disk first.

Recommended preflight checks before deploying a heavier demo:

```bash
ssh -i ~/.ssh/khovrov_dev_vps deploy@khovrov.dev
free -h
df -hT /
docker stats --no-stream
docker system df
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

If disk is tight, ask before cleanup. A likely cleanup candidate is BuildKit cache:

```bash
docker builder prune
```

Use a more aggressive prune only after an explicit user approval and after explaining what will be removed.

## Codex Interaction Runbook

Use read-only commands freely after the user approves external access for the task. Ask before commands that mutate remote state.

SSH:

```powershell
ssh -i $env:USERPROFILE\.ssh\khovrov_dev_vps deploy@khovrov.dev
```

Portfolio status:

```bash
cd /var/www/khovrov.dev
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f caddy
docker compose --env-file .env.production run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
```

Independent project status examples:

```bash
cd /opt/kb-rag-auditor
docker compose ps
docker compose logs -f

cd /opt/khovrov-n8n
docker compose ps
docker compose logs -f
```

Network checks from Caddy:

```bash
docker exec khovrovdev-caddy-1 getent hosts demo-app
docker exec khovrovdev-caddy-1 wget -S -O- http://demo-app:3000/health
```

Production smoke checks from local PowerShell:

```powershell
Invoke-WebRequest https://khovrov.dev/ -MaximumRedirection 0
Invoke-WebRequest https://chat.khovrov.dev/ -MaximumRedirection 0
Invoke-WebRequest https://automation.khovrov.dev/ -MaximumRedirection 0
```

The `automation.khovrov.dev` root is expected to return `401` unless credentials are supplied.

## Repository Boundaries

Follow these rules from `AGENTS.md` and `ops/DEPLOYMENT.md`:

- Do not commit `.env*`, SSH keys, database dumps, API keys, or `public/cv.pdf`.
- Add database migrations as new numbered SQL files under `db/`; migrations are append-only.
- Do not overwrite VPS-only `.env.production`.
- Do not add public subdomain routes only on the VPS; track them in `ops/caddy/Caddyfile`.
- Keep Open WebUI's route free of Caddy basic auth because Open WebUI uses the `Authorization` header internally.
- The browser must never receive `OPENWEBUI_API_KEY`.
- Public site actions should go to `/api/site-actions`; do not log raw IP addresses.

## Open Questions for Future Work

- The VPS has significant Docker build cache. Decide whether to prune before adding a heavy demo.
- Confirm whether a new heavy demo should reuse existing Qdrant or run its own storage.
- Confirm whether the demo needs public anonymous access, Caddy basic auth, app-level login, or no public route.
- Confirm expected load before choosing resource limits.
