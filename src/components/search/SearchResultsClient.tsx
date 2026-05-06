"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import PostCard from "@/components/posts/PostCard";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localizePath } from "@/i18n/locales";
import type { PostMeta } from "@/lib/posts";
import {
  getSearchDocuments,
  type SearchDocument,
  type SearchTrainingDocument,
  type SearchTrainingSource,
} from "@/lib/search-documents";

const MAX_VISIBLE_RESULTS = 40;
const MIN_QUERY_LENGTH = 2;

interface SearchResultsClientProps {
  query: string;
  posts: PostMeta[];
  locale: Locale;
  trainingSets: SearchTrainingSource[];
}

function TrainingResultCard({
  result,
  locale,
}: {
  result: SearchTrainingDocument;
  locale: Locale;
}) {
  const dictionary = getDictionary(locale);

  return (
    <article
      className="post-card group animate-fade-in overflow-hidden rounded-2xl border transition-all duration-300"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="game-chip">{dictionary.game.training}</span>
          {result.categories.slice(0, 3).map((category) => (
            <span key={category} className="game-chip">
              {category}
            </span>
          ))}
        </div>
        <Link href={result.href}>
          <h2
            className="mb-2 text-xl font-semibold leading-snug transition-colors duration-200 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text-primary)" }}
          >
            {result.title}
          </h2>
        </Link>
        <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
          {result.description}
        </p>
        <p
          className="mt-3 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          {result.questionCount} {dictionary.game.questions}
        </p>
      </div>
    </article>
  );
}

export default function SearchResultsClient({
  query,
  posts,
  locale,
  trainingSets,
}: SearchResultsClientProps) {
  const dictionary = getDictionary(locale);
  const normalizedQuery = query.trim();
  const canSearch = normalizedQuery.length >= MIN_QUERY_LENGTH;
  const validPosts = useMemo(
    () =>
      (Array.isArray(posts) ? posts : []).filter(
        (post) => post && post.slug && typeof post.slug === "string"
      ),
    [posts]
  );
  const documents = useMemo(
    () => getSearchDocuments(validPosts, locale, trainingSets),
    [locale, trainingSets, validPosts]
  );

  const fuse = useMemo(
    () =>
      new Fuse(documents, {
        includeScore: true,
        threshold: 0.34,
        keys: [
          { name: "title", weight: 0.45 },
          { name: "description", weight: 0.3 },
          { name: "tags", weight: 0.15 },
          { name: "categories", weight: 0.1 },
        ],
      }),
    [documents]
  );

  const results = useMemo(
    () =>
      canSearch
        ? fuse.search(normalizedQuery).map((result) => result.item).filter(Boolean)
        : [],
    [canSearch, fuse, normalizedQuery]
  );
  const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS);

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

        {query && canSearch && (
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {dictionary.search.found} {results.length}{" "}
            {results.length === 1 ? dictionary.search.result : dictionary.search.results}
            {results.length > MAX_VISIBLE_RESULTS ? ` · ${dictionary.search.showingTop} ${MAX_VISIBLE_RESULTS}` : ""}
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
              {query && !canSearch
                ? dictionary.search.minimumLength
                : query
                  ? dictionary.search.empty
                  : dictionary.search.start}
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
          visibleResults.map((result: SearchDocument) =>
            result.kind === "post" ? (
              <PostCard key={result.slug} post={result} />
            ) : (
              <TrainingResultCard key={result.id} result={result} locale={locale} />
            )
          )
        )}
      </div>
    </div>
  );
}
