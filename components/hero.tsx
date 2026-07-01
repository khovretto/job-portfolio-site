import { contactLinks } from "@/lib/profile";
import { ContactLink } from "@/components/contact-link";
import { CvDownload } from "@/components/cv-download";
import { getMessages } from "@/lib/i18n/server";

// Renders text where [[...]] spans are highlighted with the accent color.
function renderAccented(text: string) {
  return text.split(/(\[\[.*?\]\])/g).map((part, index) => {
    const match = part.match(/^\[\[(.*?)\]\]$/);
    if (match) {
      return (
        <span key={index} style={{ color: "var(--accent)" }}>
          {match[1]}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export async function Hero() {
  const m = await getMessages();
  return (
    <section id="hero" style={{ paddingTop: 56, paddingBottom: 28 }}>
      <div className="container">
        <div className="hero-id">
          <div aria-label="portrait placeholder" className="portrait-placeholder" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="mono" style={{ color: "var(--ink-3)", fontSize: 11 }}>
              {m.hero.kicker}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-2)", flexWrap: "wrap" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Maksim Khovrov</strong>
              <span style={{ color: "var(--ink-4)" }}>/</span>
              <span>{m.hero.location}</span>
              <span style={{ color: "var(--ink-4)" }}>/</span>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                GMT+2
              </span>
            </div>
          </div>
        </div>

        <h1 className="hero-title">
          <span className="hero-role">{m.hero.role}</span>
          <span className="hero-tagline">{renderAccented(m.hero.tagline)}</span>
        </h1>

        <p className="hero-subline">{m.hero.subline}</p>

        <div className="hero-actions">
          <a href="#demos" className="btn primary lg hero-demo-cta">
            {m.hero.tryDemos}
            <span aria-hidden="true">↓</span>
          </a>
          <CvDownload className="btn lg">{m.hero.downloadCv}</CvDownload>
          <ContactLink href={`mailto:${contactLinks.email}`} targetName="email" className="btn ghost lg">
            {m.hero.contact}
          </ContactLink>
        </div>

        <p className="hero-demo-hint mono">{m.hero.demoPrompt}</p>
      </div>
    </section>
  );
}
