import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate, getPostHref } from "@/lib/utils";

interface RecentlyUpdatedSectionProps {
  posts: PostMeta[];
  heading: string;
  locale: string;
  excludeSlug?: string;
}

export default function RecentlyUpdatedSection({
  posts,
  heading,
  locale,
  excludeSlug,
}: RecentlyUpdatedSectionProps) {
  const visiblePosts = posts.filter((post) => post.slug !== excludeSlug).slice(0, 5);

  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <section className="panel-section" id="access-lastmod">
      <h3 className="panel-heading">{heading}</h3>
      <ul className="panel-list">
        {visiblePosts.map((post) => (
          <li key={post.slug} className="panel-item">
            <Link href={getPostHref(post)} className="panel-link">
              <span className="panel-title">{post.title}</span>
              <time className="panel-date" dateTime={post.lastModified || post.date}>
                {formatDate(post.lastModified || post.date, "short", locale)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
