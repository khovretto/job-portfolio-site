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
- no content editor in v1

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

## Future LLM Integration

If `/api/chat` is upgraded from mock responses to a real LLM provider:

- keep API keys server-side only
- add stricter rate limits
- add abuse monitoring
- avoid logging secrets or sensitive user content
- keep public-scope refusal behavior

The Open WebUI portfolio integration uses a non-admin service account key stored only in `.env.production`. The public browser may choose only from the server-enforced assistant model allowlist, and `/api/chat` must never proxy arbitrary model ids or expose the Open WebUI API key.
