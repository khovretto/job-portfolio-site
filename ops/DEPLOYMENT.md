# khovrov.dev Deployment

This project is designed for a Hostinger VPS using Docker Compose and Caddy.

## Required DNS

Point these A records to the VPS IPv4 address:

- `@` -> VPS IP
- `www` -> VPS IP
- `stats` -> VPS IP

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

## Runtime Commands

From `/var/www/khovrov.dev`:

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f caddy
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
