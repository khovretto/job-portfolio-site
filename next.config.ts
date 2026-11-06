import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Uploaded CV PDFs go through a server action; the action itself enforces 8 MB.
    serverActions: { bodySizeLimit: "9mb" },
  },
  // pdfkit reads its data files from disk, so it must not be bundled.
  serverExternalPackages: ["pdfkit"],
  // The CV builder reads these at runtime; the standalone build must carry them.
  outputFileTracingIncludes: {
    "/admin/**": ["./lib/cv/fonts/**"],
  },
};

export default nextConfig;
