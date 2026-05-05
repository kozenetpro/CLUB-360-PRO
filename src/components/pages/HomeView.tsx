import PostCard from "@/components/posts/PostCard";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { getAllPosts } from "@/lib/posts";

interface HomeViewProps {
  locale: Locale;
}

export default function HomeView({ locale }: HomeViewProps) {
  const dictionary = getDictionary(locale);
  const posts = getAllPosts().filter((post) => post.lang === locale);

  return (
    <div>
      <section
        className="hero-card mb-6 rounded-2xl border p-5 animate-fade-in sm:p-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <p
          className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          {dictionary.home.kicker}
        </p>
        <h2
          className="mb-2 text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {dictionary.site.tagline}
        </h2>
        <p
          className="text-sm leading-7"
          style={{ color: "var(--text-secondary)" }}
        >
          {dictionary.site.description}
        </p>
      </section>

      <div id="post-list" className="space-y-4">
        {posts.length === 0 ? (
          <div
            className="text-center py-20 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {dictionary.home.empty}
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </div>
  );
}
