# Backlog

Deferred work and follow-ups. Keep this list current — add items here instead of
losing them in chat.

## Deferred

### Demos: mobile layout redesign
- **Status:** deferred (intentionally, by request).
- **Why later:** the three demo modules (`components/demos/demo-ai.tsx`,
  `demo-kb.tsx`, `demo-conlang.tsx`) will change once the demos themselves are
  finished, so redoing the responsive layout now would be wasted effort.
- **Scope when picked up:** the demo shells use `.two-pane` / `.pane` grids and a
  few fixed grid-template widths (e.g. `.pipeline-row`, `.output-grid`,
  `.demo-tabs`) in `app/globals.css`. On narrow screens they crowd / overflow.
  Rework after the demo content/feature set is locked.

## Done (for reference)

- EN/RU i18n via JSON catalogs + cookie locale toggle (`messages/`, `lib/i18n/`).
- Hero redesign: shorter tagline, demos-first CTA, removed the long
  "voice agents / RAG / automation workflows" statement.
- Small fixes: language toggle no longer clipped in the nav; theme switcher is an
  icon; contact rows reflow cleanly (incl. Russian "open" label); removed the
  floating bottom-right CV button.
- CV downloads: admin upload page (`/admin/cv`) storing EN/RU PDFs in Postgres
  (`cv_files`, migration `db/004_cv_files.sql`), served via `/api/cv?lang=`, with
  a language popup on the public download buttons (`components/cv-download.tsx`).

## Notes / possible follow-ups

- CVs are stored in Postgres as `bytea` (max 8 MB enforced in the upload action).
  If CVs ever grow large or need versioning, consider object storage instead.
- `/api/cv` falls back to the other language if the requested one isn't uploaded,
  so a single uploaded PDF still serves both buttons.
