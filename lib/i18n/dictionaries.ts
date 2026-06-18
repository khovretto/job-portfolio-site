import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import type { Locale } from "./config";

// `en.json` is the source of truth for the message shape. Other locales are
// validated against it at build time via this `Messages` type.
export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = {
  en,
  ru: ru as Messages,
};

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale];
}
