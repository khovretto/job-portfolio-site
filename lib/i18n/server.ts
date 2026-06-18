import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { getDictionary, type Messages } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getMessages(): Promise<Messages> {
  return getDictionary(await getLocale());
}
