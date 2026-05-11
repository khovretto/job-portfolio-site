import { contactLinks } from "@/lib/profile";
import { ContactLink } from "@/components/contact-link";

const tags = [
  "Voice agents",
  "RAG (Qdrant / Zep)",
  "n8n",
  "LangChain",
  "OpenAI",
  "Python",
  "TypeScript",
  "Bitrix24 / amoCRM / 1C",
  "Prompt Engineering",
];

export function Hero() {
  return (
    <section id="hero" style={{ paddingTop: 56, paddingBottom: 28 }}>
      <div className="container">
        <div className="hero-id">
          <div aria-label="portrait placeholder" className="portrait-placeholder" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="mono" style={{ color: "var(--ink-3)", fontSize: 11 }}>
              {"// portfolio / v1 / 2026"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-2)", flexWrap: "wrap" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Maksim Khovrov</strong>
              <span style={{ color: "var(--ink-4)" }}>/</span>
              <span>Novi Sad, Serbia</span>
              <span style={{ color: "var(--ink-4)" }}>/</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                GMT+2
              </span>
            </div>
          </div>
        </div>

        <h1 className="hero-title">
          <span className="hero-role">AI Automation Engineer</span>
          <span className="hero-statement">
            building <span style={{ color: "var(--accent)" }}>production voice agents</span>,{" "}
            <span style={{ color: "var(--accent)" }}>RAG systems</span> & automation workflows.
          </span>
        </h1>

        <p className="hero-subline">
          4.5 years in development and automation, with 2+ years focused on LLM systems and AI agents.
          I combine engineering, evaluation and business judgement; I have managed a team of 10. Open to remote.
        </p>

        <div className="hero-actions" style={{ marginBottom: 18 }}>
          <ContactLink href="/cv.pdf" targetName="cv" className="btn primary lg">
            Download CV
          </ContactLink>
          <a href="#demos" className="btn lg">
            Try the demos
          </a>
          <ContactLink href={`mailto:${contactLinks.email}`} targetName="email" className="btn ghost lg">
            Contact
          </ContactLink>
          <span style={{ flex: 1 }} />
          <span className="mono hero-shortcut" style={{ color: "var(--ink-4)", fontSize: 11 }}>
            scroll down
          </span>
        </div>

        <div className="tag-rail">
          {tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
