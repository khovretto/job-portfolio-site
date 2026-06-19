import { NextResponse, type NextRequest } from "next/server";
import { resolveCvFile } from "@/lib/cv-data";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const locale = isLocale(langParam) ? langParam : defaultLocale;

  let file;
  try {
    file = await resolveCvFile(locale);
  } catch {
    return NextResponse.json({ error: "CV is temporarily unavailable." }, { status: 503 });
  }

  if (!file) {
    return NextResponse.json({ error: "CV has not been uploaded yet." }, { status: 404 });
  }

  const body = new Uint8Array(file.data);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": file.contentType || "application/pdf",
      "Content-Length": String(body.byteLength),
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.filename)}"`,
      "Cache-Control": "no-store",
    },
  });
}
