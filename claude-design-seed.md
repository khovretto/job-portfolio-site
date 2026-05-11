# Claude Design Seed Prompt

Design a high-fidelity one-page recruiter portfolio for an AI Automation Engineer targeting remote AI teams. The site should feel like a clean technical product interface, not a generic personal landing page.

## Positioning

Hero message:

> AI Automation Engineer building production voice agents, RAG systems, and automation workflows.

The candidate is based in Novi Sad, Serbia, open to remote work, and has 4.5 years in development and automation with 2+ years focused on LLM systems and AI agents.

## Site Structure

Use a one-page layout with anchor navigation:

- Hero
- Production proof metrics
- Interactive demos
- Experience / operating model
- Technical stack
- Contact / CV CTA

The first screen should immediately communicate the role, proof, and technical credibility. Avoid marketing-style hero composition. The page should feel closer to an AI operations dashboard or technical product surface.

## Proof Points

Use anonymized proof only:

- 30+ voice robots launched into production
- 4.5 years in development and automation
- 2+ years focused on LLM systems and AI agents
- 3 RAG pipelines deployed with Qdrant and Zep
- Reported RAG response accuracy improved from 70% to 98%
- 15+ technical audits and commercial proposals supporting $400K+ in closed deals
- Automation team scaled from 3 to 10+ people during restructuring
- Sectors: medical, retail, recruitment, finance, municipal infrastructure, B2C support

Do not expose client names or confidential implementation details.

## Interactive Demo Modules

Create three simulated interactive modules. They do not need real APIs for v1, but each should include default, loading, success, empty, and failure states.

### 1. Personal AI Assistant

- Chat interface with text input and audio input control
- Answers only from public knowledge about the candidate
- Show source chips, confidence, and public-only scope
- Include integration status indicators

### 2. Public Knowledge Base Audit + RAG Builder

- Inputs: public URL, optional email, optional company name
- Simulated stages: crawl, validate, chunk, embed, evaluate
- Output: estimated completion time, estimated cost, confidence level
- Include blocked/invalid URL failure state

### 3. Conlang Word Generator + Audio Recognition

- Generate approximately 150 constructed-language words
- Show searchable word list
- Include audio input and simulated recognition feedback
- Recognition result should show confidence and closest alternatives

## Visual Direction

- Clean technical product UI
- Dense but readable layout for recruiter scanning
- Neutral base with restrained accents; avoid generic purple AI gradients
- Cards should have 8px radius or less
- No nested cards
- Responsive desktop and mobile layouts
- Text must not overlap controls at any viewport size
- Use real interface states and product surfaces as the primary visuals

## CTAs

Include clear calls to action:

- Review demos
- Contact
- Download CV
- LinkedIn placeholder
- GitHub placeholder

Use placeholders for exact email, LinkedIn, GitHub, and final CV PDF until those assets are ready.
