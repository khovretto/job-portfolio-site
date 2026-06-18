"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Messages } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

function useLocaleContext(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useMessages/useLocale must be used within a LocaleProvider");
  }
  return value;
}

export function useMessages(): Messages {
  return useLocaleContext().messages;
}

export function useLocale(): Locale {
  return useLocaleContext().locale;
}
