-- Appends "how this site is built" facts to the existing public_context so the
-- assistant can answer meta questions about the site/demo itself. Appends
-- rather than overwrites so any manual edits made via /admin/assistant are
-- preserved; guarded so re-running is a no-op.
update assistant_config
set public_context = public_context || $extra$

How this site is built:
This portfolio is a Next.js (App Router) app backed by Postgres, deployed with Docker Compose and Caddy on a self-managed VPS, with GitHub Actions handling CI/CD on every push. This chat assistant is grounded by Mnemosyne, a self-built RAG system: a profile-pinned broker sits in front of a Postgres registry and a Qdrant vector store, and this demo's access token is pinned to a public-only profile. Private collections are not filtered out after the fact — they are simply not reachable from this token, so there is no private data for the assistant to leak even if asked.
$extra$,
    updated_at = now()
where id = true
  and public_context not like '%How this site is built:%'
  and char_length(public_context) < 19000;
