import { query } from "@/lib/db";
import { locales, type Locale } from "@/lib/i18n/config";
import { defaultCvContent } from "@/lib/cv/defaults";
import { cvContentSchema, type CvContent } from "@/lib/cv/schema";

export type CvMeta = {
  locale: Locale;
  filename: string;
  contentType: string;
  sizeBytes: number;
  updatedAt: Date;
};

export type CvFile = CvMeta & { data: Buffer };

export async function listCvMeta(): Promise<CvMeta[]> {
  const result = await query<{
    locale: Locale;
    filename: string;
    content_type: string;
    size_bytes: number;
    updated_at: Date;
  }>(
    `select locale, filename, content_type, size_bytes, updated_at
     from cv_files
     order by locale`,
  );
  return result.rows.map((row) => ({
    locale: row.locale,
    filename: row.filename,
    contentType: row.content_type,
    sizeBytes: row.size_bytes,
    updatedAt: row.updated_at,
  }));
}

export async function getCvFile(locale: Locale): Promise<CvFile | null> {
  const result = await query<{
    locale: Locale;
    filename: string;
    content_type: string;
    size_bytes: number;
    updated_at: Date;
    data: Buffer;
  }>(
    `select locale, filename, content_type, size_bytes, updated_at, data
     from cv_files
     where locale = $1`,
    [locale],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    locale: row.locale,
    filename: row.filename,
    contentType: row.content_type,
    sizeBytes: row.size_bytes,
    updatedAt: row.updated_at,
    data: row.data,
  };
}

// Resolve a CV for download, falling back to any other uploaded locale so a
// single uploaded file still serves both language buttons.
export async function resolveCvFile(preferred: Locale): Promise<CvFile | null> {
  const direct = await getCvFile(preferred);
  if (direct) return direct;
  for (const locale of locales) {
    if (locale === preferred) continue;
    const fallback = await getCvFile(locale);
    if (fallback) return fallback;
  }
  return null;
}

export async function upsertCvFile(
  locale: Locale,
  filename: string,
  contentType: string,
  data: Buffer,
): Promise<void> {
  await query(
    `insert into cv_files (locale, filename, content_type, data, size_bytes, updated_at)
     values ($1, $2, $3, $4, $5, now())
     on conflict (locale) do update
       set filename = excluded.filename,
           content_type = excluded.content_type,
           data = excluded.data,
           size_bytes = excluded.size_bytes,
           updated_at = now()`,
    [locale, filename, contentType, data, data.length],
  );
}

export async function deleteCvFile(locale: Locale): Promise<void> {
  await query(`delete from cv_files where locale = $1`, [locale]);
}

export type CvDraft = {
  content: CvContent;
  updatedAt: Date | null;
  publishedAt: Date | null;
};

// Falls back to the starting content until a language is first saved.
export async function getCvDraft(locale: Locale): Promise<CvDraft> {
  const result = await query<{ content: unknown; updated_at: Date; published_at: Date | null }>(
    `select content, updated_at, published_at from cv_documents where locale = $1`,
    [locale],
  );
  const row = result.rows[0];
  if (!row) return { content: defaultCvContent(locale), updatedAt: null, publishedAt: null };

  const parsed = cvContentSchema.safeParse(row.content);
  return {
    content: parsed.success ? parsed.data : defaultCvContent(locale),
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

export async function saveCvDraft(locale: Locale, content: CvContent): Promise<void> {
  await query(
    `insert into cv_documents (locale, content, updated_at)
     values ($1, $2, now())
     on conflict (locale) do update
       set content = excluded.content,
           updated_at = now()`,
    [locale, JSON.stringify(content)],
  );
}

export async function markCvPublished(locale: Locale): Promise<void> {
  await query(`update cv_documents set published_at = now() where locale = $1`, [locale]);
}
