export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function humanizeSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const DEFAULT_POST_LANG = "en";

export function splitPostSlug(value: string) {
  const parts = value.split("/").filter(Boolean);

  if (parts.length > 1) {
    return {
      lang: parts[0],
      slug: parts.slice(1).join("/"),
    };
  }

  return {
    lang: DEFAULT_POST_LANG,
    slug: parts[0] ?? "",
  };
}

export function getPostHref(post: { slug: string; lang?: string } | string) {
  const rawSlug = typeof post === "string" ? post : post.slug;
  const explicitLang = typeof post === "string" ? undefined : post.lang;
  const { lang, slug } = rawSlug.includes("/")
    ? splitPostSlug(rawSlug)
    : { lang: explicitLang ?? DEFAULT_POST_LANG, slug: rawSlug };

  return lang === DEFAULT_POST_LANG ? `/posts/${slug}` : `/${lang}/posts/${slug}`;
}

export function isPostPath(pathname: string) {
  return /^\/(?:[a-z]{2}\/)?posts\/[^/]+$/.test(pathname);
}

export function getPostSlugFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 2 && segments[0] === "posts") {
    return `${DEFAULT_POST_LANG}/${segments[1]}`;
  }

  if (segments.length === 3 && segments[1] === "posts") {
    return `${segments[0]}/${segments[2]}`;
  }

  return undefined;
}

export function formatDate(value: string, style: "long" | "short" = "long", locale = "en-US") {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: style === "short" ? "short" : "long",
    day: "numeric",
  });

  return formatter.format(new Date(value));
}
