import path from "node:path";
import PDFDocument from "pdfkit";
import type { Locale } from "@/lib/i18n/config";
import type { CvContent } from "@/lib/cv/schema";

const FONT_DIR = path.join(process.cwd(), "lib", "cv", "fonts");
const REGULAR = "regular";
const SEMIBOLD = "semibold";

const INK = "#15171a";
const MUTED = "#5c6168";
const ACCENT = "#d5251a";

const MARGIN = 42;
const BODY = 9.2;

const titles: Record<
  Locale,
  Record<"summary" | "experience" | "responsibilities" | "achievements" | "projects" | "skills" | "education" | "languages", string>
> = {
  en: {
    summary: "Summary",
    experience: "Experience",
    responsibilities: "Responsibilities",
    achievements: "Key achievements",
    projects: "Personal Projects",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
  },
  ru: {
    summary: "О себе",
    experience: "Опыт работы",
    responsibilities: "Обязанности",
    achievements: "Ключевые результаты",
    projects: "Личные проекты",
    skills: "Навыки",
    education: "Образование",
    languages: "Языки",
  },
};

function safeLink(url: string): string | undefined {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : undefined;
}

export function renderCvPdf(cv: CvContent, locale: Locale): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: { Title: `${cv.name} — CV`, Author: cv.name },
      lang: locale,
      displayTitle: true,
      font: path.join(FONT_DIR, "Inter-400.ttf"),
    });
    doc.registerFont(REGULAR, path.join(FONT_DIR, "Inter-400.ttf"));
    doc.registerFont(SEMIBOLD, path.join(FONT_DIR, "Inter-600.ttf"));

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const width = doc.page.width - MARGIN * 2;
    const bottom = doc.page.height - MARGIN;

    function ensureSpace(height: number) {
      if (doc.y + height > bottom) doc.addPage();
    }

    function section(title: string) {
      ensureSpace(44);
      doc.moveDown(0.75);
      doc.font(SEMIBOLD).fontSize(8.5).fillColor(ACCENT);
      doc.text(title.toUpperCase(), MARGIN, doc.y, { characterSpacing: 0.8 });
      doc.moveDown(0.35);
    }

    // A title on the left with its period on the right.
    function entryHead(title: string, period: string, link?: string) {
      const periodWidth = period ? Math.min(170, doc.font(REGULAR).fontSize(8.5).widthOfString(period) + 2) : 0;
      const titleWidth = width - periodWidth - (period ? 10 : 0);
      doc.font(SEMIBOLD).fontSize(10.5);
      ensureSpace(doc.heightOfString(title, { width: titleWidth }) + 26);
      const y = doc.y;
      // A new page resets the font, so it is set after the check.
      doc.font(SEMIBOLD).fontSize(10.5).fillColor(INK).text(title, MARGIN, y, { width: titleWidth, link, underline: false });
      const after = doc.y;
      if (period) {
        doc.font(REGULAR).fontSize(8.5).fillColor(MUTED);
        doc.text(period, MARGIN + width - periodWidth, y + 1.5, { width: periodWidth, align: "right" });
      }
      doc.x = MARGIN;
      doc.y = Math.max(after, doc.y);
    }

    function body(text: string, color = INK) {
      doc.font(REGULAR).fontSize(BODY).fillColor(color);
      doc.text(text, MARGIN, doc.y, { width, lineGap: 1.5 });
    }

    function bullets(items: string[]) {
      doc.font(REGULAR).fontSize(BODY).fillColor(INK);
      doc.moveDown(0.15);
      for (const item of items) {
        const height = doc.heightOfString(item, { width: width - 11, lineGap: 1.5 });
        ensureSpace(height + 2);
        const y = doc.y;
        doc.font(REGULAR).fontSize(BODY).fillColor(ACCENT).text("•", MARGIN, y, { lineBreak: false });
        doc.fillColor(INK).text(item, MARGIN + 11, y, { width: width - 11, lineGap: 1.5 });
        doc.y += 1.5;
      }
    }

    const t = titles[locale];

    // Header
    doc.font(SEMIBOLD).fontSize(22).fillColor(INK).text(cv.name, MARGIN, MARGIN);
    if (cv.headline) doc.font(REGULAR).fontSize(12).fillColor(INK).text(cv.headline);
    doc.moveDown(0.3);
    if (cv.location) doc.font(REGULAR).fontSize(8.5).fillColor(MUTED).text(cv.location);

    const contacts = cv.contacts.filter((item) => item.label);
    if (contacts.length) {
      // Placed one by one, so an address moves to the next line whole instead of breaking at a slash.
      doc.font(REGULAR).fontSize(8.5).fillColor(MUTED);
      const separator = "  ·  ";
      const separatorWidth = doc.widthOfString(separator);
      const lineHeight = doc.currentLineHeight(true);
      let x = MARGIN;
      let y = doc.y;
      contacts.forEach((item, index) => {
        const labelWidth = doc.widthOfString(item.label);
        if (index) {
          if (x + separatorWidth + labelWidth > MARGIN + width) {
            x = MARGIN;
            y += lineHeight;
          } else {
            doc.text(separator, x, y, { lineBreak: false });
            x += separatorWidth;
          }
        }
        // A link's clickable box needs an explicit width when the line does not wrap.
        doc.text(item.label, x, y, { width: labelWidth + 1, lineBreak: false, link: safeLink(item.url) ?? null, underline: false });
        x += labelWidth;
      });
      doc.x = MARGIN;
      doc.y = y + lineHeight;
    }

    doc.moveDown(0.6);
    doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + width, doc.y).lineWidth(0.8).strokeColor(ACCENT).stroke();

    if (cv.summary) {
      section(t.summary);
      body(cv.summary);
    }

    const experience = cv.experience.filter((item) => item.role || item.company);
    if (experience.length) {
      section(t.experience);
      experience.forEach((item, index) => {
        if (index) doc.moveDown(0.6);
        entryHead(item.role || item.company, item.period);
        if (item.role && item.company) {
          doc.font(REGULAR).fontSize(BODY).fillColor(MUTED);
          doc.text(item.company, MARGIN, doc.y, { width, link: safeLink(item.url) ?? null, underline: false });
        }
        for (const [label, items] of [
          [t.responsibilities, item.responsibilities],
          [t.achievements, item.achievements],
        ] as const) {
          if (!items.length) continue;
          ensureSpace(32);
          doc.moveDown(0.25);
          doc.font(SEMIBOLD).fontSize(BODY).fillColor(INK).text(label, MARGIN, doc.y, { width });
          bullets(items);
        }
      });
    }

    const projects = cv.projects.filter((item) => item.name);
    if (projects.length) {
      section(t.projects);
      if (cv.projectsNote) {
        body(cv.projectsNote, MUTED);
        doc.moveDown(0.25);
      }
      projects.forEach((item, index) => {
        if (index) doc.moveDown(0.5);
        entryHead(item.name, item.period, safeLink(item.url));
        if (item.description) body(item.description);
        if (item.bullets.length) bullets(item.bullets);
      });
    }

    const skills = cv.skills.filter((item) => item.items);
    if (skills.length) {
      section(t.skills);
      for (const item of skills) {
        ensureSpace(24);
        if (item.group) {
          doc.font(SEMIBOLD).fontSize(BODY).fillColor(INK).text(`${item.group}: `, MARGIN, doc.y, {
            width,
            continued: true,
            lineGap: 1.5,
          });
          doc.font(REGULAR).text(item.items, { lineGap: 1.5 });
        } else {
          body(item.items);
        }
        doc.y += 1;
      }
    }

    const education = cv.education.filter((item) => item.institution);
    if (education.length) {
      section(t.education);
      education.forEach((item, index) => {
        if (index) doc.moveDown(0.4);
        entryHead(item.institution, item.period);
        if (item.degree) body(item.degree, MUTED);
      });
    }

    const languages = cv.languages.filter((item) => item.name);
    if (languages.length) {
      section(t.languages);
      body(languages.map((item) => (item.level ? `${item.name} (${item.level})` : item.name)).join("  ·  "));
    }

    doc.end();
  });
}

export function cvFilename(cv: CvContent, locale: Locale): string {
  const ascii = locale === "en" ? cv.name : "Maksim Khovrov";
  const slug = ascii.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "") || "CV";
  return `${slug}_CV_${locale.toUpperCase()}.pdf`;
}
