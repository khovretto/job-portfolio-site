import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCvDraft } from "@/lib/cv-data";
import { cvFilename, renderCvPdf } from "@/lib/cv/render";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

// Builds the saved draft on demand without touching the published PDF.
export async function GET(request: NextRequest) {
  await requireAdmin();

  const langParam = request.nextUrl.searchParams.get("lang");
  const locale = isLocale(langParam) ? langParam : defaultLocale;
  const { content } = await getCvDraft(locale);
  const pdf = await renderCvPdf(content, locale);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      "Content-Disposition": `inline; filename="${cvFilename(content, locale)}"`,
      "Cache-Control": "no-store",
    },
  });
}
