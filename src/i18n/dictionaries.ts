import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/locales";
import { en, type Dictionary } from "@/i18n/dictionaries/en";
import { pt } from "@/i18n/dictionaries/pt";

const dictionaries = {
  en,
  pt,
} satisfies Record<Locale, Dictionary>;

export type { Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getDictionaryForLocale(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : DEFAULT_LOCALE];
}
