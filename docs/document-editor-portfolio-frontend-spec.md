# Document Editor Portfolio Frontend Spec

Date: 2026-07-01
Status: design handoff for a stronger UI pass

## Recommendation

Present Document Editor as a product case study with a live-demo CTA, not as another small toy demo. The strongest story is: "I built an evidence-backed document workspace where automation helps structure work, but every drafted sentence stays traceable to source material."

Keep the live app at `https://editor.khovrov.dev` gated until demo reset, abuse limits, and sample data are routine. The portfolio page can still describe the workflow publicly and link to the gated app.

## Source Context

- Portfolio route already exists in `ops/caddy/Caddyfile` for `editor.khovrov.dev`.
- The public demo is the sanitized Hostinger/khovrov.dev deployment, not the real client deployment.
- Original project path: `C:\Users\User\Documents\Work\Document editor`.
- Source docs used for this spec:
  - `README.md`
  - `docs/PROJECT_CONTEXT.md`
  - `docs/PORTFOLIO_DEMO_DEPLOYMENT.md`
  - Mnemosyne note `Client Work/head-msk/Document Editor.md`

## Product Framing

Document Editor turns source DOCX/PDF documents into a structured, reviewable workspace:

1. Upload source documents.
2. Extract fragments from headings, paragraphs, tables, and pages.
3. Map source fragments to a target section tree.
4. Draft section text in an editor.
5. Insert citations back to the exact source fragments.
6. Track review issues and reviewer comments.
7. Export a DOCX working package.

Core message: automation is subordinate to evidence traceability. Do not imply the system replaces expert review.

## Public Boundaries

Do not present the public demo as:

- autonomous compliance output;
- legal, tax, geological, or engineering advice;
- inspection-ready reporting;
- a fully generic multi-template SaaS;
- a scanned-PDF/OCR product that is already production-mature.

Safe wording:

- "evidence-backed document preparation workspace"
- "structured drafting with source citations"
- "human-reviewed document assembly"
- "sanitized portfolio deployment"
- "DOCX/PDF source ingestion, fragment mapping, and DOCX export"

## Audience

Primary: hiring managers and senior engineers evaluating whether the candidate can build real, deployed internal tools.

Secondary: AI tools summarizing the site for recruiters.

The page should answer:

- What business problem does this solve?
- What makes it more serious than a CRUD app?
- Where is the AI/automation boundary?
- What was deployed and hardened?
- What can a reviewer click today?

## Recommended Placement

Current low-risk implementation: fourth tab inside the existing `#demos` module.

Better design target: replace the crowded demo tabs with a "Project systems" section:

- left rail: four selectable projects;
- main area: case-study preview for the active project;
- each project has one concrete live interaction or live link;
- Document Editor gets a wider workflow preview than the smaller demos.

If keeping tabs, Document Editor should not be visually identical to the conlang demo. It should feel like a deployed operations tool preview.

## Content Hierarchy

Use this hierarchy in the final UI:

1. Label: `Deployed case study`
2. Title: `Evidence-backed document preparation`
3. One-sentence value prop:
   `Turn messy DOCX/PDF source material into structured section drafts with citations back to inspectable source fragments.`
4. Workflow strip:
   `Upload -> Extract -> Map -> Draft -> Review -> Export`
5. Proof chips:
   - `FastAPI + React`
   - `DOCX/PDF ingestion`
   - `TipTap citations`
   - `SQLite persistence`
   - `Docker + Caddy`
   - `auth/rate limits/upload caps`
6. CTA:
   `Open gated demo`
7. Boundary note:
   `Sanitized sample-data deployment. Human review remains required.`

## Visual Direction

Style should remain compatible with the current portfolio: dense, technical, restrained, and scan-friendly. Avoid marketing hero treatment for this module.

Recommended visual:

- A split operational workspace preview.
- Left: target section tree with mapped counts.
- Center: source fragment list with citation markers.
- Right: draft/review panel with a small DOCX export status.
- Use table rows, status dots, progress bars, and line-level citation chips.
- Keep cards at 8px radius or less.
- Do not use decorative gradients, floating orbs, or stock document imagery.

The module should look like a real internal tool, not a product landing page.

## Interaction Model

Minimum:

- CTA opens `https://editor.khovrov.dev` in a new tab.
- Track click as `document_editor_opened`.
- Show that the demo is protected/gated before the user clicks.

Preferred:

- Add a small non-networked workflow simulation inside the portfolio page:
  - select a section;
  - highlight 2-3 mapped fragments;
  - insert one citation into a draft preview;
  - update a coverage meter.
- Keep it deterministic and local; do not upload files from the portfolio page.

## Copy Blocks

Short description:

```text
Document Editor turns messy source DOCX/PDF material into a structured workspace where every drafted section can be traced back to inspectable source fragments.
```

Long description:

```text
Built as a deployed evidence-authoring tool: source files are preserved, parser output stays reviewable, humans map evidence to sections, drafts keep citations, and the app exports a DOCX working package. The public deployment is sanitized and gated separately from the real client deployment.
```

Boundary:

```text
This is document preparation, not autonomous compliance or final expert approval.
```

## Implementation Notes

Current portfolio files touched by the first integration:

- `components/demos.tsx`
- `components/demos/demo-document-editor.tsx`
- `messages/en.json`
- `messages/ru.json`
- `app/globals.css`
- `public/llms.txt`

Future UI work should keep route ownership in the portfolio repo's `ops/caddy/Caddyfile`; do not add VPS-only public routes by hand.

## Acceptance Criteria

- The first viewport of the demo module makes "Document Editor" visible as a serious deployed project.
- It is clear the live app is gated and sanitized.
- The workflow explains source evidence traceability without needing domain-specific OISZ/geology context.
- No private client details, PDFs, report names, credentials, screenshots with real data, or production database content appear in the portfolio.
- Build, lint, and typecheck pass before deployment.
