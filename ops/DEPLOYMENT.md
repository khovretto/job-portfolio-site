# khovrov.dev Deployment

This project is designed for a Hostinger VPS using Docker Compose and Caddy.

## Required DNS

Point these A records to the VPS IPv4 address:

- `@` -> VPS IP
- `www` -> VPS IP
- `stats` -> VPS IP

`chat.khovrov.dev` is routed by this repository's Caddy container to the separate Open WebUI project under `/opt/personal-voice-assistant`. Keep the Caddy route tracked in `ops/caddy/Caddyfile`; do not leave it as VPS-only state, because deploy cleanup replaces the Caddy config from Git. Do not put Caddy basic auth in front of Open WebUI; it conflicts with Open WebUI requests that use the `Authorization` header.

`.dev` domains require working HTTPS in browsers. Caddy handles certificates automatically after DNS resolves and ports `80` and `443` reach the VPS.

## SSH Keys

Use separate SSH keys by purpose.

Recommended keys:

- Personal laptop -> VPS access key
- GitHub Actions -> VPS deploy key

Do not reuse the same private key for GitHub, the VPS root user, and automated deployment.

Generate the GitHub Actions deploy key locally:

```powershell
ssh-keygen -t ed25519 -C "github-actions-khovrov-dev" -f "$env:USERPROFILE\.ssh\khovrov_dev_github_actions"
```

Add the public key to `/home/deploy/.ssh/authorized_keys` on the VPS.

Add the private key content to GitHub repository secret:

- `VPS_SSH_PRIVATE_KEY`

## GitHub Secrets

Repository: `git@github.com:khovretto/job-portfolio-site.git`

Required Actions secrets:

- `VPS_HOST` - VPS IP address
- `VPS_USER` - `deploy`
- `VPS_DEPLOY_PATH` - `/var/www/khovrov.dev`
- `VPS_SSH_PRIVATE_KEY` - private key for GitHub Actions to SSH into the VPS

## First VPS Setup

After Hostinger gives you root access:

Generated local key paths:

- Local VPS access key: `C:\Users\User\.ssh\khovrov_dev_vps`
- GitHub Actions deploy key: `C:\Users\User\.ssh\khovrov_dev_github_actions`

Run `ops/vps-bootstrap.sh` as root on the VPS with the two generated public keys:

```bash
export DEPLOY_PUBLIC_KEY='paste C:\Users\User\.ssh\khovrov_dev_vps.pub here'
export GITHUB_ACTIONS_PUBLIC_KEY='paste C:\Users\User\.ssh\khovrov_dev_github_actions.pub here'
bash ops/vps-bootstrap.sh
```

Create `/var/www/khovrov.dev/.env.production` from `.env.production.example` and replace every secret.

Then the GitHub Actions workflow can deploy on pushes to `main`.

## Caddy Basic Auth Hashes

Some subdomains are additionally protected by Caddy basic auth. The hashes live only in `/var/www/khovrov.dev/.env.production`:

```text
CADDY_KB_AUDIT_ADMIN_HASH=<bcrypt hash>
CADDY_AUTOMATION_ADMIN_HASH=<bcrypt hash>
```

Generate a new hash on the VPS with:

```bash
docker exec khovrovdev-caddy-1 caddy hash-password --plaintext 'new-password'
```

Do not commit plaintext passwords or generated basic-auth hashes.

## Deploy Workflow Behavior

The GitHub Actions workflow:

1. Runs `npm ci`, `npm run typecheck`, and `npm run build`.
2. Cleans `/var/www/khovrov.dev` while preserving `.env.production`, `.env.production.*`, and `docker-data`.
3. Uploads the repository to `/var/www/khovrov.dev`, excluding `.git`, `node_modules`, `.next`, `docker-data`, and real/local env files.
4. Starts Postgres if needed.
5. Validates the Caddy config with production env values.
6. Builds the app image with `--no-cache` to avoid stale Next.js standalone output.
7. Runs database migrations and admin initialization.
8. Force-recreates the app and Caddy containers.

Do not store production secrets in the repository. The source upload intentionally does not overwrite `/var/www/khovrov.dev/.env.production`.

## Subdomain Project Pattern

The portfolio repo owns the public Caddy reverse proxy for `khovrov.dev`. Other projects may live in separate repos or `/opt/...` folders, but their public routes must still be tracked in this repo.

For each independent project:

1. Run the app in its own Docker Compose project.
2. Attach the app service to the shared external network:

   ```yaml
   networks:
     khovrovdev_default:
       external: true
   ```

3. Give the app a stable network alias:

   ```yaml
   services:
     my-app:
       networks:
         khovrovdev_default:
           aliases:
             - my-app
   ```

4. Add the public route in `ops/caddy/Caddyfile`:

   ```caddyfile
   my-app.khovrov.dev {
     encode zstd gzip
     reverse_proxy my-app:3000
   }
   ```

5. If the route needs Caddy basic auth, put only the env variable name in `.env.example` and the real hash in `/var/www/khovrov.dev/.env.production`.

Do not manually add VPS-only Caddy routes. The deploy workflow cleans and replaces the Caddy config from Git, so manual routes can disappear on the next deployment.

## Runtime Commands

From `/var/www/khovrov.dev`:

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f caddy
docker compose --env-file .env.production run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
docker compose --env-file .env.production run --rm app npm run db:migrate
docker compose --env-file .env.production run --rm app npm run db:init-admin
```

## Umami

Umami is served at:

```text
https://stats.khovrov.dev
```

Change the default Umami admin password immediately after first login.

After creating the `khovrov.dev` website in Umami, copy its website id into `.env.production` as `UMAMI_WEBSITE_ID` and redeploy so the public site can include the tracker.

## Personal Assistant Open WebUI

The public assistant demo can call the private Open WebUI instance through the Docker network. Add these values to `/var/www/khovrov.dev/.env.production`:

```text
OPENWEBUI_BASE_URL=http://openwebui:8080
OPENWEBUI_API_KEY=<portfolio-demo non-admin user key>
ASSISTANT_DEFAULT_MODEL=~openai/gpt-mini-latest
ASSISTANT_ALLOWED_MODELS=~google/gemini-flash-latest,~openai/gpt-mini-latest,~anthropic/claude-haiku-latest
```

Generate the key from a non-admin Open WebUI user dedicated to the public portfolio demo. Do not expose this key in browser-visible variables, GitHub Actions secrets output, or committed files.

The public assistant prompt and context are editable at:

```text
https://khovrov.dev/admin/assistant
```

The edited config is stored in the portfolio Postgres database table `assistant_config`. Keep this content public, anonymized, and free of secrets.

If Open WebUI group model permissions return an empty model list for the service account, the current pragmatic setting is:

```text
BYPASS_MODEL_ACCESS_CONTROL=true
```

That setting belongs in the Open WebUI project environment, not this repo. The portfolio backend still enforces its own three-model allowlist before calling Open WebUI.
