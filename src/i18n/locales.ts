export const DEFAULT_LOCALE = "en";
export const LOCALES = ["en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getLocalePrefix(locale: Locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  return firstSegment && isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

export function stripLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    return `/${segments.slice(1).join("/")}` || "/";
  }

  return pathname || "/";
}

export function localizePath(pathname: string, locale: Locale) {
  const normalizedPath = stripLocaleFromPathname(pathname);
  const prefix = getLocalePrefix(locale);

  return normalizedPath === "/" ? prefix || "/" : `${prefix}${normalizedPath}`;
}

export function getAlternateLocalePath(pathname: string, locale: Locale) {
  return localizePath(pathname, locale);
}
