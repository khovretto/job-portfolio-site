import { ContactLink } from "@/components/contact-link";
import { CvDownload } from "@/components/cv-download";
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
          <CvDownload className="btn lg">{m.contact.downloadCv}</CvDownload>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {links.map((link) => (
          <ContactLink key={link.key} href={link.href} targetName={link.target} className="contact-row">
            <span className="mono contact-row-key">{link.key}</span>
            <span
              className="contact-row-value"
              style={{ color: link.target === "email" ? "var(--accent)" : "var(--ink)" }}
            >
              {link.value}
            </span>
            <span className="mono contact-row-open">{m.contact.open}</span>
          </ContactLink>
        ))}
      </div>
      <style>{`
        .contact-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 14px 8px;
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
        .contact-row-key {
          color: var(--ink-3);
        }
        .contact-row-value {
          min-width: 0;
          font-family: var(--mono);
          font-size: 13.5px;
          overflow-wrap: anywhere;
        }
        .contact-row-open {
          justify-self: end;
          color: var(--ink-4);
          font-size: 11px;
          white-space: nowrap;
        }
        @media (max-width: 520px) {
          .contact-row {
            grid-template-columns: auto minmax(0, 1fr);
            gap: 4px 10px;
            padding: 12px 6px;
          }
          .contact-row-value {
            grid-column: 1 / -1;
          }
          .contact-row-open {
            grid-row: 1;
            grid-column: 2;
          }
        }
      `}</style>
    </div>
  );
}
