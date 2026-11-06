import Link from "next/link";
import { uploadCvAction, deleteCvAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { CvEditor } from "@/components/admin/cv-editor";
import { formatDate } from "@/lib/admin-data";
import { getCvDraft, listCvMeta, type CvDraft, type CvMeta } from "@/lib/cv-data";
import { defaultCvContent } from "@/lib/cv/defaults";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Russian",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const savedMessages: Record<string, string> = {
  draft: "Draft saved. The preview shows it; visitors still get the published PDF.",
  published: "CV built and published. Visitors now download this version.",
  deleted: "CV removed.",
  "1": "CV uploaded.",
};

const errorMessages: Record<string, string> = {
  locale: "Unknown language.",
  empty: "No file was selected.",
  size: "File is too large (max 8 MB).",
  type: "Only PDF files are accepted.",
  invalid: "The CV was not saved: a field is too long or the name is empty.",
};

type Props = {
  searchParams?: Promise<{ saved?: string; error?: string; lang?: string }>;
};

async function safeListCvMeta(): Promise<CvMeta[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await listCvMeta();
  } catch (error) {
    console.warn("cv list fallback", error instanceof Error ? error.message : error);
    return [];
  }
}

async function safeGetCvDraft(locale: Locale): Promise<CvDraft> {
  try {
    return await getCvDraft(locale);
  } catch (error) {
    console.warn("cv draft fallback", error instanceof Error ? error.message : error);
    return { content: defaultCvContent(locale), updatedAt: null, publishedAt: null };
  }
}

function draftStatus(draft: CvDraft) {
  if (!draft.updatedAt) return "not saved yet: showing the starting content";
  if (!draft.publishedAt) return `saved ${formatDate(draft.updatedAt)}, not published`;
  if (draft.updatedAt > draft.publishedAt) return `saved ${formatDate(draft.updatedAt)}, has unpublished changes`;
  return `published ${formatDate(draft.publishedAt)}`;
}

export default async function CvAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const locale = isLocale(params?.lang ?? null) ? (params?.lang as Locale) : defaultLocale;
  const [uploaded, draft] = await Promise.all([safeListCvMeta(), safeGetCvDraft(locale)]);
  const byLocale = new Map<Locale, CvMeta>(uploaded.map((cv) => [cv.locale, cv]));
  const saved = params?.saved;
  const error = params?.error;
  const previewVersion = draft.updatedAt?.getTime() ?? 0;

  return (
    <AdminShell>
      <section>
        <span className="mono">cv</span>
        <h1 style={{ margin: "6px 0 10px", fontSize: 30 }}>CV builder</h1>
        <p style={{ margin: "0 0 18px", color: "var(--ink-3)", maxWidth: 820 }}>
          Edit the content for each language, check the preview, then publish. Publishing replaces the PDF that
          visitors get from <code>/api/cv?lang=en</code> and <code>/api/cv?lang=ru</code>. If only one language has
          a PDF, it is served for both download buttons.
        </p>

        {saved ? (
          <div className="surf-2" style={{ marginBottom: 12, padding: 12, color: "var(--ok)" }}>
            {savedMessages[saved] || "Saved."}
          </div>
        ) : null}
        {error ? (
          <div className="surf-2" style={{ marginBottom: 12, padding: 12, color: "var(--bad)" }}>
            {errorMessages[error] || "Action failed."}
          </div>
        ) : null}

        <div className="cv-tabs">
          {locales.map((item) => (
            <Link key={item} href={`/admin/cv?lang=${item}`} className={`btn sm ${item === locale ? "primary" : ""}`}>
              {localeNames[item]}
            </Link>
          ))}
          <span className="mono" style={{ color: "var(--ink-4)", textTransform: "none", letterSpacing: 0 }}>
            {draftStatus(draft)}
          </span>
        </div>

        <div className="cv-builder">
          <CvEditor key={`${locale}-${previewVersion}`} locale={locale} initial={draft.content} />
          <div className="surf cv-preview">
            <div className="cv-preview-head">
              <span className="mono">preview of the saved draft</span>
              <a className="btn sm" href={`/admin/cv/preview?lang=${locale}`} target="_blank" rel="noreferrer">
                Open PDF
              </a>
            </div>
            <iframe
              key={previewVersion}
              title={`CV preview, ${localeNames[locale]}`}
              src={`/admin/cv/preview?lang=${locale}&v=${previewVersion}#view=FitH`}
            />
          </div>
        </div>

        <h2 style={{ margin: "32px 0 6px", fontSize: 20 }}>Published PDFs</h2>
        <p style={{ margin: "0 0 14px", color: "var(--ink-3)", maxWidth: 820 }}>
          These are what visitors download. Uploading a PDF here replaces a built one, and the other way round.
        </p>

        <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {locales.map((item) => {
            const current = byLocale.get(item);
            return (
              <div key={item} className="surf" style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{localeNames[item]}</h3>
                  <span className="mono" style={{ color: "var(--ink-4)" }}>lang={item}</span>
                </div>

                <div className="surf-2" style={{ marginTop: 12, padding: 12 }}>
                  {current ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <a
                        href={`/api/cv?lang=${item}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 13, wordBreak: "break-all" }}
                      >
                        {current.filename}
                      </a>
                      <span className="mono" style={{ color: "var(--ink-4)", fontSize: 11 }}>
                        {formatBytes(current.sizeBytes)} / updated {formatDate(current.updatedAt)}
                      </span>
                    </div>
                  ) : (
                    <span className="mono" style={{ color: "var(--ink-4)" }}>
                      no file published
                    </span>
                  )}
                </div>

                <form action={uploadCvAction} className="admin-form" style={{ marginTop: 12 }}>
                  <input type="hidden" name="locale" value={item} />
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf,.pdf"
                    required
                    className="form-input"
                    style={{ padding: 8 }}
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" type="submit">
                      {current ? "Replace with a PDF" : "Upload PDF"}
                    </button>
                  </div>
                </form>

                {current ? (
                  <form action={deleteCvAction} style={{ marginTop: 8 }}>
                    <input type="hidden" name="locale" value={item} />
                    <button className="btn sm" type="submit">
                      Remove
                    </button>
                  </form>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
