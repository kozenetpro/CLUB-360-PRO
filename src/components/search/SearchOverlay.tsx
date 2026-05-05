"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocaleFromPathname, localizePath, stripLocaleFromPathname } from "@/i18n/locales";

function SearchInputInner({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const searchPath = localizePath("/search", locale);
  const normalizedPathname = stripLocaleFromPathname(pathname);
  const [query, setQuery] = useState(initialQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only update URL if on search page, and only after debounce
    if (normalizedPathname === "/search") {
      debounceTimer.current = setTimeout(() => {
        if (query.trim()) {
          startTransition(() => {
            router.push(`${searchPath}?q=${encodeURIComponent(query.trim())}`);
          });
        } else {
          startTransition(() => {
            router.push(searchPath);
          });
        }
      }, 500); // Longer debounce for better UX
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [normalizedPathname, query, router, searchPath]);

  return (
    <div className="relative w-48">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--text-muted)" }}
      />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={dictionary.search.placeholder}
        className="w-full rounded-lg border px-3 py-2 pl-9 pr-3 text-sm outline-none transition-colors"
        style={{
          background: "var(--search-bg)",
          color: "var(--text-secondary)",
          borderColor: "var(--search-border-color)",
        }}
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const searchPath = localizePath("/search", locale);
  const normalizedPathname = stripLocaleFromPathname(pathname);

  if (normalizedPathname !== "/search") {
    return (
      <>
        <button
          type="button"
          onClick={() => router.push(searchPath)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border sm:hidden hover:opacity-70 transition-opacity"
          style={{
            background: "var(--search-bg)",
            color: "var(--text-muted)",
            borderColor: "var(--search-border-color)",
          }}
          aria-label={dictionary.search.open}
        >
          <Search size={16} />
        </button>

        <div className="hidden sm:block">
          <SearchInputInner initialQuery={initialQuery} />
        </div>
      </>
    );
  }

  return <SearchInputInner initialQuery={initialQuery} />;
}

export function SearchResultsPortal() {
  return null;
}

export default function SearchOverlay() {
  return <SearchInput />;
}
