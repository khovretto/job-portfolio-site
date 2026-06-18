"use client";

import { locales, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { useLocale, useMessages } from "@/lib/i18n/provider";
import { trackEvent } from "@/components/event-tracker";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function LanguageToggle() {
  const active = useLocale();
  const m = useMessages();

  function select(next: Locale) {
    if (next === active) return;
    // eslint-disable-next-line react-hooks/immutability -- persisting the locale choice is a deliberate DOM side effect in a click handler
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${ONE_YEAR};samesite=lax`;
    trackEvent("language_switch", { locale: next });
    // Full reload so server components and all client-side demo state
    // re-initialize in the newly selected locale.
    window.location.reload();
  }

  return (
    <div className="lang-toggle" role="group" aria-label={m.nav.language}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          className={`lang-option ${locale === active ? "active" : ""}`}
          aria-pressed={locale === active}
          onClick={() => select(locale)}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
