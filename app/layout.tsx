import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://khovrov.dev"),
  title: "Maksim Khovrov | AI Automation Engineer",
  description:
    "AI Automation Engineer building production voice agents, RAG systems, and automation workflows.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maksim Khovrov | AI Automation Engineer",
    description:
      "Production voice agents, RAG systems, automation workflows, and public project demos.",
    url: "/",
    siteName: "Maksim Khovrov",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        {children}
        {process.env.UMAMI_WEBSITE_ID ? (
          <Script
            defer
            src="https://stats.khovrov.dev/script.js"
            data-website-id={process.env.UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
