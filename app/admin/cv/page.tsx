import { uploadCvAction, deleteCvAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { formatDate } from "@/lib/admin-data";
import { listCvMeta, type CvMeta } from "@/lib/cv-data";
import { locales, type Locale } from "@/lib/i18n/config";

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

const errorMessages: Record<string, string> = {
  locale: "Unknown language.",
  empty: "No file was selected.",
  size: "File is too large (max 8 MB).",
  type: "Only PDF files are accepted.",
};

type Props = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
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

export default async function CvAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const uploaded = await safeListCvMeta();
  const byLocale = new Map<Locale, CvMeta>(uploaded.map((cv) => [cv.locale, cv]));
  const saved = params?.saved;
  const error = params?.error;

  return (
    <AdminShell>
      <section>
        <span className="mono">cv</span>
        <h1 style={{ margin: "6px 0 10px", fontSize: 30 }}>Downloadable CVs</h1>
        <p style={{ margin: "0 0 18px", color: "var(--ink-3)", maxWidth: 820 }}>
          Upload a PDF per language. Visitors download these from the site via{" "}
          <code>/api/cv?lang=en</code> and <code>/api/cv?lang=ru</code>. If only one
          language is uploaded, it is served for both download buttons.
        </p>

        {saved ? (
          <div className="surf-2" style={{ marginBottom: 12, padding: 12, color: "var(--ok)" }}>
            {saved === "deleted" ? "CV removed." : "CV uploaded."}
          </div>
        ) : null}
        {error ? (
          <div className="surf-2" style={{ marginBottom: 12, padding: 12, color: "var(--bad)" }}>
            {errorMessages[error] || "Upload failed."}
          </div>
        ) : null}

        <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {locales.map((locale) => {
            const current = byLocale.get(locale);
            return (
              <div key={locale} className="surf" style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 18 }}>{localeNames[locale]}</h2>
                  <span className="mono" style={{ color: "var(--ink-4)" }}>lang={locale}</span>
                </div>

                <div className="surf-2" style={{ marginTop: 12, padding: 12 }}>
                  {current ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <a
                        href={`/api/cv?lang=${locale}`}
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
                      no file uploaded
                    </span>
                  )}
                </div>

                <form action={uploadCvAction} className="admin-form" style={{ marginTop: 12 }}>
                  <input type="hidden" name="locale" value={locale} />
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf,.pdf"
                    required
                    className="form-input"
                    style={{ padding: 8 }}
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn primary" type="submit">
                      {current ? "Replace PDF" : "Upload PDF"}
                    </button>
                  </div>
                </form>

                {current ? (
                  <form action={deleteCvAction} style={{ marginTop: 8 }}>
                    <input type="hidden" name="locale" value={locale} />
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
