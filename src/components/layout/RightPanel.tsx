"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { PostMeta } from "@/lib/posts";
import RecentlyUpdatedSection from "@/components/panel/RecentlyUpdatedSection";
import TrendingTagsSection from "@/components/panel/TrendingTagsSection";
import TableOfContents from "@/components/posts/TableOfContents";
import { getPostSlugFromPathname, isPostPath } from "@/lib/utils";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocaleFromPathname, type Locale } from "@/i18n/locales";

interface RightPanelProps {
  recentPostsByLocale: Record<Locale, PostMeta[]>;
  tagsByLocale: Record<Locale, { name: string; count: number }[]>;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function RightPanel({ recentPostsByLocale, tagsByLocale }: RightPanelProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const localizedRecentPosts = recentPostsByLocale[locale] ?? [];
  const localizedTags = tagsByLocale[locale] ?? [];
  const [headings, setHeadings] = useState<Heading[]>([]);
  const isPostPage = isPostPath(pathname);
  const currentSlug = useMemo(
    () => (isPostPage ? getPostSlugFromPathname(pathname) : undefined),
    [isPostPage, pathname]
  );

  useEffect(() => {
    if (!isPostPage) {
      return;
    }

    const collectHeadings = () => {
      const nextHeadings = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(".post-prose h2[id], .post-prose h3[id]")
      ).map((heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() ?? "",
        level: Number(heading.tagName.replace("H", "")),
      }));

      setHeadings(nextHeadings.filter((heading) => heading.text));
    };

    const frame = requestAnimationFrame(collectHeadings);

    return () => cancelAnimationFrame(frame);
  }, [isPostPage, pathname]);

  return (
    <aside
      className="hidden xl:block w-(--panel-width) shrink-0 border-l px-5 pb-10 pt-6"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="access animate-fade-in">
        <RecentlyUpdatedSection
          posts={localizedRecentPosts}
          heading={dictionary.panel.recentlyUpdated}
          locale={locale}
          excludeSlug={currentSlug}
        />
        <TrendingTagsSection tags={localizedTags} heading={dictionary.panel.trendingTags} locale={locale} />
        {isPostPage && headings.length > 0 ? (
          <section className="panel-section">
            <h3 className="panel-heading">{dictionary.panel.contents}</h3>
            <div className="pt-3">
              <TableOfContents headings={headings} />
            </div>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
