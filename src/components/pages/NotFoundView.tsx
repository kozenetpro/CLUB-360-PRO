"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocaleFromPathname, localizePath } from "@/i18n/locales";

export default function NotFoundView() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl animate-fade-in py-8">
      <div
        className="rounded-2xl border px-6 py-10 sm:px-8"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          404
        </p>

        <h1
          className="mb-3 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--text-primary)" }}
        >
          {dictionary.notFound.title}
        </h1>

        <p
          className="max-w-2xl text-sm leading-7 sm:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {dictionary.notFound.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={localizePath("/", locale)}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            {dictionary.notFound.goHome}
          </Link>
          <Link
            href={localizePath("/categories", locale)}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
              background: "var(--bg-body)",
            }}
          >
            {dictionary.notFound.browseCategories}
          </Link>
          <Link
            href={localizePath("/tags", locale)}
            className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
              background: "var(--bg-body)",
            }}
          >
            {dictionary.notFound.viewTags}
          </Link>
        </div>
      </div>
    </div>
  );
}
