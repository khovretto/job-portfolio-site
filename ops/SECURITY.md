# Security Notes

## Secrets

Never commit:

- `.env`
- `.env.production`
- SSH private keys
- database dumps
- real API keys

## Admin Panel

The admin panel is intentionally narrow:

- one admin user
- no public registration
- secure HTTP-only session cookie
- assistant prompt/context editor only; not a general CMS
- admin-only access to chat, audit, event, and error logs

## VPS SSH

The VPS baseline is:

- SSH key login only
- root SSH login disabled
- password SSH disabled
- `deploy` user used for maintenance and GitHub Actions deployments
- `fail2ban` enabled for SSH brute-force protection

`deploy` is in the Docker group and has passwordless sudo. Treat that SSH key as root-equivalent in practice.

## Logging Policy

The app logs operational events for debugging and portfolio improvement:

- event type
- path
- referrer
- user agent
- anonymized IP hash
- metadata relevant to the event

The app does not store raw IP addresses. The KB audit demo stores whether an optional email was supplied, not the email itself.

The browser sends first-party site action logs to `/api/site-actions`. `/api/events` is retained as a compatibility alias, but new client code should prefer `/api/site-actions` because generic event endpoint names are more likely to be blocked by privacy tools.

## LLM Integration

`/api/chat` calls Open WebUI server-side in production:

- keep API keys server-side only
- add stricter rate limits
- add abuse monitoring
- avoid logging secrets or sensitive user content
- keep public-scope refusal behavior

The Open WebUI portfolio integration uses a non-admin service account key stored only in `.env.production`. The public browser may choose only from the server-enforced assistant model allowlist, and `/api/chat` must never proxy arbitrary model ids or expose the Open WebUI API key.

The assistant system prompt and public context are editable from `/admin/assistant`. Treat that page as production behavior: do not paste private customer names, internal implementation details, secrets, or unverifiable claims into the public context.
