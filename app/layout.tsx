import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/provider";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { StructuredData } from "@/components/structured-data";

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

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://khovrov.dev"),
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.ogDescription,
      url: "/",
      siteName: "Maksim Khovrov",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = getDictionary(locale);

  return (
    <html lang={locale} data-theme="dark" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        <StructuredData />
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
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
