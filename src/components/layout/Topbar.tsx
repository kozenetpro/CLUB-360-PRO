"use client";

import { Suspense, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SearchInput } from "@/components/search/SearchOverlay";
import { humanizeSlug } from "@/lib/utils";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocaleFromPathname, localizePath, stripLocaleFromPathname } from "@/i18n/locales";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function getSegmentLabel(segment: string, dictionary: ReturnType<typeof getDictionary>) {
  const labels: Record<string, string> = {
    about: dictionary.nav.about,
    archives: dictionary.nav.archives,
    categories: dictionary.nav.categories,
    members: dictionary.nav.members,
    posts: dictionary.common.posts,
    search: dictionary.nav.search,
    tags: dictionary.nav.tags,
  };

  return labels[segment] ?? humanizeSlug(segment);
}

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: dictionary.nav.home, href: localizePath("/", locale) }];

  if (normalizedPathname === "/") {
    return items;
  }

  if (segments.length === 2 && segments[0] === "posts") {
    return [...items, { label: humanizeSlug(segments[1]) }];
  }

  if (segments.length === 3 && segments[1] === "posts") {
    return [...items, { label: humanizeSlug(segments[2]) }];
  }

  if (segments.length === 2 && (segments[0] === "categories" || segments[0] === "tags")) {
    return [
      ...items,
      { label: getSegmentLabel(segments[0], dictionary), href: localizePath(`/${segments[0]}`, locale) },
      { label: humanizeSlug(segments[1]) },
    ];
  }

  return [
    ...items,
    ...segments.map((segment, index) => ({
      label: getSegmentLabel(segment, dictionary),
      href:
        index === segments.length - 1
          ? undefined
          : localizePath(`/${segments.slice(0, index + 1).join("/")}`, locale),
    })),
  ];
}

export default function Topbar() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => buildBreadcrumbs(pathname), [pathname]);
  const currentLabel = breadcrumbs[breadcrumbs.length - 1]?.label ?? getDictionary(getLocaleFromPathname(pathname)).nav.home;

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        background: "var(--topbar-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex h-14 items-center justify-between px-4 lg:px-8">
        <div
          className="min-w-0 flex-1 truncate pl-10 pr-3 text-sm sm:hidden"
          style={{ color: "var(--breadcrumb-text)" }}
        >
          {currentLabel}
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center gap-2 text-sm sm:flex"
          style={{ color: "var(--breadcrumb-text)" }}
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href ?? `${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-xs">/</span>}
              {index === breadcrumbs.length - 1 || !crumb.href ? (
                <span>{crumb.label}</span>
              ) : (
                <Link href={crumb.href} style={{ color: "var(--text-secondary)" }}>
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="shrink-0" style={{ color: "var(--text-secondary)" }}>
          <Suspense fallback={<div className="h-10 w-48 rounded-lg border" style={{ borderColor: "var(--search-border-color)" }} />} >
            <SearchInput />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
