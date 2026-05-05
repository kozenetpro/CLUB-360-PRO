import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { getAllPosts } from "@/lib/posts";
import { formatDate, getPostHref } from "@/lib/utils";

interface ArchivesViewProps {
  locale: Locale;
}

export default function ArchivesView({ locale }: ArchivesViewProps) {
  const dictionary = getDictionary(locale);
  const posts = getAllPosts().filter((post) => post.lang === locale);
  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div>
      <h1
        className="text-3xl font-bold mt-4 mb-8 animate-fade-in"
        style={{ color: "var(--text-primary)" }}
      >
        {dictionary.nav.archives}
      </h1>

      <div id="archives" className="animate-fade-in">
        {years.map((year) => (
          <div key={year} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {year}
              </h2>
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: "var(--timeline-dot)",
                  background: "var(--bg-body)",
                }}
              />
            </div>

            <div
              className="ml-6 border-l-2 pl-6 space-y-4"
              style={{ borderColor: "var(--timeline-line)" }}
            >
              {grouped[year].map((post) => {
                const formattedDate = formatDate(post.date, "short", locale);

                return (
                  <div key={post.slug} className="relative flex items-baseline gap-4">
                    <div
                      className="absolute -left-7.75 top-1.5 w-2.5 h-2.5 rounded-full"
                      style={{ background: "var(--timeline-dot)" }}
                    />
                    <div
                      className="text-sm font-mono shrink-0 w-24 text-right"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formattedDate}
                    </div>
                    <Link
                      href={getPostHref(post)}
                      className="text-sm font-medium hover:underline transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      {post.title}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
