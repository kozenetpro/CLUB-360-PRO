"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import PostCard from "@/components/posts/PostCard";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localizePath } from "@/i18n/locales";
import type { PostMeta } from "@/lib/posts";

interface SearchResultsClientProps {
  query: string;
  posts: PostMeta[];
  locale: Locale;
}

export default function SearchResultsClient({ query, posts, locale }: SearchResultsClientProps) {
  const dictionary = getDictionary(locale);
  // Ensure posts is an array and filter out any invalid entries
  const validPosts = (Array.isArray(posts) ? posts : []).filter(
    (post) => post && post.slug && typeof post.slug === "string"
  );

  const fuse = useMemo(
    () =>
      new Fuse(validPosts, {
        includeScore: true,
        threshold: 0.34,
        keys: [
          { name: "title", weight: 0.45 },
          { name: "description", weight: 0.3 },
          { name: "tags", weight: 0.15 },
          { name: "categories", weight: 0.1 },
        ],
      }),
    [validPosts]
  );

  const results = useMemo(
    () =>
      query.trim()
        ? fuse.search(query.trim()).map((result) => result.item).filter(Boolean)
        : [],
    [fuse, query]
  );

  return (
    <div>
      <section
        className="hero-card mb-6 rounded-2xl border p-5 animate-fade-in sm:p-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >

        <h2
          className="mb-4 text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {query ? `${dictionary.search.resultsFor} "${query}"` : dictionary.search.noQuery}
        </h2>

        {query && (
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {dictionary.search.found} {results.length}{" "}
            {results.length === 1 ? dictionary.search.result : dictionary.search.results}
          </p>
        )}
      </section>

      {/* Results list */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div
            className="text-center py-20"
            style={{ color: "var(--text-muted)" }}
          >
            <p className="mb-4">
              {query ? dictionary.search.empty : dictionary.search.start}
            </p>
            <Link
              href={localizePath("/", locale)}
              className="text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {dictionary.common.backToHome}
            </Link>
          </div>
        ) : (
          results.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </div>
  );
}
