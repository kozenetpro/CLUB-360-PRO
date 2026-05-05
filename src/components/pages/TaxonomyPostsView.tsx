import PostCard from "@/components/posts/PostCard";
import type { Locale } from "@/i18n/locales";
import type { PostMeta } from "@/lib/posts";

interface TaxonomyPostsViewProps {
  locale: Locale;
  posts: PostMeta[];
  title: string;
  prefix?: string;
}

export default function TaxonomyPostsView({ posts, title, prefix = "" }: TaxonomyPostsViewProps) {
  return (
    <div>
      <h1
        className="text-3xl font-bold mt-4 mb-8 animate-fade-in"
        style={{ color: "var(--text-primary)" }}
      >
        {prefix}{title}
      </h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
