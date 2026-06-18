import { ContactLink } from "@/components/contact-link";
import { contactLinks } from "@/lib/profile";
import { getMessages } from "@/lib/i18n/server";

const links = [
  { key: "email", value: contactLinks.email, href: `mailto:${contactLinks.email}`, target: "email" as const },
  { key: "linkedin", value: "in/maksim-khovrov-113633293", href: contactLinks.linkedin, target: "linkedin" as const },
  { key: "github", value: "github.com/mkhovrov01", href: contactLinks.github, target: "github" as const },
];

export async function Contact() {
  const m = await getMessages();
  return (
    <div className="surf contact-grid" style={{ padding: 28, alignItems: "center" }}>
      <div>
        <span className="mono">{m.contact.label}</span>
        <h2 style={{ margin: "6px 0 8px", fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          {m.contact.title}
        </h2>
        <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 15, maxWidth: 540 }}>
          {m.contact.body}
        </p>
        <p style={{ margin: "10px 0 0", color: "var(--ink-4)", fontSize: 12.5, maxWidth: 560 }}>
          {m.contact.privacy}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
          <ContactLink href={`mailto:${contactLinks.email}`} targetName="email" className="btn primary lg">
            {m.contact.emailMe}
          </ContactLink>
          <ContactLink href="/cv.pdf" targetName="cv" className="btn lg">
            {m.contact.downloadCv}
          </ContactLink>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {links.map((link, index) => (
          <ContactLink key={link.key} href={link.href} targetName={link.target} className="contact-row">
            <span className="mono">{link.key}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 13.5, color: link.target === "email" ? "var(--accent)" : "var(--ink)" }}>
              {link.value}
            </span>
            <span style={{ color: "var(--ink-4)", textAlign: "right" }}>{m.contact.open}</span>
          </ContactLink>
        ))}
      </div>
      <style>{`
        .contact-row {
          display: grid;
          grid-template-columns: 90px 1fr 42px;
          gap: 12px;
          align-items: center;
          padding: 14px 4px;
          border-top: 1px dashed var(--line);
          color: var(--ink);
          border-radius: 6px;
        }
        .contact-row:first-child {
          border-top: none;
        }
        .contact-row:hover {
          background: var(--surf-2);
        }
      `}</style>
    </div>
  );
}
