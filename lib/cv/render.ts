import path from "node:path";
import PDFDocument from "pdfkit";
import type { Locale } from "@/lib/i18n/config";
import type { CvContent } from "@/lib/cv/schema";

const FONT_DIR = path.join(process.cwd(), "lib", "cv", "fonts");
const LOGO = path.join(process.cwd(), "public", "brand", "logo.png");
const REGULAR = "regular";
const SEMIBOLD = "semibold";

const INK = "#16181c";
const MUTED = "#5d636c";
const ACCENT = "#d5251a";
const RAIL = "#f1f2f4";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const RAIL_W = 166;
const RAIL_X = 22;
const RAIL_TEXT_W = RAIL_W - 38;
const MAIN_X = RAIL_W + 22;
const MAIN_W = PAGE_W - MAIN_X - 30;
const TOP = 30;
const BOTTOM = PAGE_H - 26;

const BODY = 9;
const LINE_GAP = 1.15;
const LABEL = 7.6;
const SECTION = 10.5;

const titles: Record<
  Locale,
  Record<"contacts" | "summary" | "experience" | "responsibilities" | "achievements" | "projects" | "skills" | "education" | "languages", string>
> = {
  en: {
    contacts: "Contact",
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
    contacts: "Контакты",
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
      margin: 0,
      bufferPages: true,
      info: { Title: `${cv.name} — CV`, Author: cv.name },
      lang: locale,
      displayTitle: true,
      font: path.join(FONT_DIR, "Commissioner-400.ttf"),
    });
    doc.registerFont(REGULAR, path.join(FONT_DIR, "Commissioner-400.ttf"));
    doc.registerFont(SEMIBOLD, path.join(FONT_DIR, "Commissioner-600.ttf"));

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const t = titles[locale];

    const paintRail = () => {
      doc.save().rect(0, 0, RAIL_W, PAGE_H).fill(RAIL).restore();
    };
    paintRail();

    function ensureSpace(height: number) {
      if (doc.y + height > BOTTOM) {
        doc.addPage({ size: "A4", margin: 0 });
        paintRail();
        doc.y = TOP;
      }
    }

    function label(text: string, x: number, width: number, color: string) {
      doc.font(SEMIBOLD).fontSize(LABEL).fillColor(color);
      doc.text(text.toUpperCase(), x, doc.y, { width, characterSpacing: 0.9 });
    }

    let firstSection = true;
    function section(title: string, room = 56) {
      ensureSpace(room);
      if (!firstSection) doc.y += 10;
      firstSection = false;
      doc.font(SEMIBOLD).fontSize(SECTION).fillColor(INK);
      doc.text(title.toUpperCase(), MAIN_X, doc.y, { width: MAIN_W, characterSpacing: 0.6 });
      const ruleY = doc.y + 1;
      doc.moveTo(MAIN_X, ruleY).lineTo(MAIN_X + MAIN_W, ruleY).lineWidth(1).strokeColor(ACCENT).stroke();
      doc.y = ruleY + 4.5;
    }

    function body(text: string, color = INK) {
      for (const line of text.split("\n")) {
        doc.font(REGULAR).fontSize(BODY);
        ensureSpace(doc.heightOfString(line, { width: MAIN_W, lineGap: LINE_GAP }));
        // A new page resets the font, so it is set after the check.
        doc.font(REGULAR).fontSize(BODY).fillColor(color).text(line, MAIN_X, doc.y, { width: MAIN_W, lineGap: LINE_GAP });
        doc.y += 1;
      }
    }

    function bullets(items: string[]) {
      for (const item of items) {
        doc.font(REGULAR).fontSize(BODY);
        ensureSpace(doc.heightOfString(item, { width: MAIN_W - 9, lineGap: LINE_GAP }));
        const y = doc.y;
        doc.font(REGULAR).fontSize(BODY).fillColor(ACCENT).text("•", MAIN_X, y, { width: 7, lineBreak: false });
        doc.fillColor(INK).text(item, MAIN_X + 9, y, { width: MAIN_W - 9, lineGap: LINE_GAP });
        doc.y += 0.6;
      }
    }

    function entryHead(title: string, period: string) {
      doc.font(REGULAR).fontSize(BODY - 0.5);
      const periodWidth = period ? doc.widthOfString(period) + 2 : 0;
      ensureSpace(38);
      const y = doc.y;
      doc.font(SEMIBOLD).fontSize(BODY + 1.2).fillColor(INK).text(title, MAIN_X, y, { width: MAIN_W - periodWidth - 8 });
      const after = doc.y;
      if (period) {
        doc.font(REGULAR).fontSize(BODY - 0.5).fillColor(MUTED);
        doc.text(period, MAIN_X + MAIN_W - periodWidth, y + 1.2, { width: periodWidth, align: "right", lineBreak: false });
      }
      doc.y = after;
    }

    // Main column first: text extractors, including hiring systems, read a PDF in the order it was written.
    doc.font(SEMIBOLD).fontSize(23).fillColor(INK).text(cv.name, MAIN_X, TOP - 4, { width: MAIN_W });
    if (cv.headline) doc.font(REGULAR).fontSize(11).fillColor(ACCENT).text(cv.headline, MAIN_X, doc.y, { width: MAIN_W });
    doc.y += 7;

    if (cv.summary) {
      section(t.summary);
      body(cv.summary);
    }

    const experience = cv.experience.filter((item) => item.role || item.company);
    if (experience.length) {
      section(t.experience);
      experience.forEach((item, index) => {
        if (index) doc.y += 5;
        entryHead(item.role || item.company, item.period);
        if (item.role && item.company) {
          doc.font(REGULAR).fontSize(BODY).fillColor(MUTED);
          doc.text(item.company, MAIN_X, doc.y, { width: MAIN_W, link: safeLink(item.url) ?? null, underline: false });
        }
        for (const [title, items] of [
          [t.responsibilities, item.responsibilities],
          [t.achievements, item.achievements],
        ] as const) {
          if (!items.length) continue;
          ensureSpace(24);
          doc.y += 2;
          doc.font(SEMIBOLD).fontSize(BODY).fillColor(INK).text(title, MAIN_X, doc.y, { width: MAIN_W });
          doc.y += 0.5;
          bullets(items);
        }
      });
    }

    const projects = cv.projects.filter((item) => item.name);
    if (projects.length) {
      section(t.projects);
      if (cv.projectsNote) body(cv.projectsNote, MUTED);
      for (const item of projects) {
        const heading = item.period ? `${item.name} (${item.period}). ` : `${item.name}. `;
        doc.font(REGULAR).fontSize(BODY);
        ensureSpace(doc.heightOfString(heading + item.description, { width: MAIN_W, lineGap: LINE_GAP }) + 2);
        doc.y += 1.5;
        doc.font(SEMIBOLD).fontSize(BODY).fillColor(INK).text(heading, MAIN_X, doc.y, {
          width: MAIN_W,
          continued: Boolean(item.description),
          lineGap: LINE_GAP,
          link: safeLink(item.url) ?? null,
          underline: false,
        });
        if (item.description) {
          doc.font(REGULAR).fontSize(BODY).fillColor(INK).text(item.description, { lineGap: LINE_GAP, link: null });
        }
        if (item.bullets.length) bullets(item.bullets);
      }
    }

    // The rail belongs to the first page, wherever the main column ended.
    doc.switchToPage(0);
    doc.image(LOGO, RAIL_X, TOP - 4, { height: 28 });
    doc.y = TOP + 36;

    function railBlock(title: string, draw: () => void) {
      label(title, RAIL_X, RAIL_TEXT_W, ACCENT);
      doc.y += 2.5;
      draw();
      doc.y += 12;
    }

    function railText(text: string, color = INK, font = REGULAR) {
      doc.font(font).fontSize(8.4).fillColor(color).text(text, RAIL_X, doc.y, { width: RAIL_TEXT_W, lineGap: 1.3 });
    }

    const contacts = cv.contacts.filter((item) => item.label);
    if (cv.location || contacts.length) {
      railBlock(t.contacts, () => {
        if (cv.location) {
          railText(cv.location, MUTED);
          doc.y += 6;
        }
        // The gap between contacts is wider than the line spacing, so a wrapped address still reads as one item.
        for (const item of contacts) {
          doc.font(REGULAR).fontSize(8.1).fillColor(INK);
          doc.text(item.label, RAIL_X, doc.y, { width: RAIL_TEXT_W, lineGap: 0.8, link: safeLink(item.url) ?? null, underline: false });
          doc.y += 4.5;
        }
      });
    }

    const skills = cv.skills.filter((item) => item.items);
    if (skills.length) {
      railBlock(t.skills, () => {
        for (const item of skills) {
          if (item.group) railText(item.group, INK, SEMIBOLD);
          railText(item.items, MUTED);
          doc.y += 3.5;
        }
      });
    }

    const education = cv.education.filter((item) => item.institution);
    if (education.length) {
      railBlock(t.education, () => {
        for (const item of education) {
          railText(item.institution, INK, SEMIBOLD);
          if (item.degree) railText(item.degree, MUTED);
          if (item.period) railText(item.period, MUTED);
        }
      });
    }

    const languages = cv.languages.filter((item) => item.name);
    if (languages.length) {
      railBlock(t.languages, () => {
        for (const item of languages) railText(item.level ? `${item.name}: ${item.level}` : item.name);
      });
    }

    doc.end();
  });
}

export function cvFilename(cv: CvContent, locale: Locale): string {
  const ascii = locale === "en" ? cv.name : "Maksim Khovrov";
  const slug = ascii.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "") || "CV";
  return `${slug}_CV_${locale.toUpperCase()}.pdf`;
}
