import Link from "next/link";
import { Pin, Sparkles } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { formatDate, getPostHref } from "@/lib/utils";
import OptimizedPostImage from "@/components/posts/OptimizedPostImage";
import { AvatarGroupOfCollaborators } from "@/components/ui/AvatarGroupOfCollaborators";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  // Guard against undefined/null values
  if (!post || !post.slug) {
    return null;
  }

  const locale = isLocale(post.lang) ? post.lang : "en";
  const dictionary = getDictionary(locale);
  const date = formatDate(post.date, "short", locale);
  const primaryCategory = post.categories?.[0] ?? dictionary.common.post;
  const secondaryCategories = post.categories?.slice(1) ?? [];

  return (
    <article
      className="post-card group animate-fade-in overflow-hidden rounded-2xl border transition-all duration-300"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className={post.image ? "md:grid md:grid-cols-[minmax(0,1fr)_240px]" : ""}>
        <div className="p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--text-muted)" }}
            >
              {primaryCategory}
            </span>
            {post.pin ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em]"
                style={{ color: "var(--pin-color)" }}
              >
                <Pin size={12} className="rotate-45" />
                {dictionary.common.pinned}
              </span>
            ) : null}
            {post.aiGenerated ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/35 bg-sky-400/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-300">
                <Sparkles size={12} />
                {dictionary.common.aiGenerated}
              </span>
            ) : null}
          </div>

          <Link href={getPostHref(post)}>
            <h2
              className="mb-2 text-xl font-semibold leading-snug transition-colors duration-200 group-hover:text-[var(--accent)]"
              style={{ color: "var(--text-primary)" }}
            >
              {post.title}
            </h2>
          </Link>

          {post.description ? (
            <p
              className="mb-4 text-sm leading-7"
              style={{ color: "var(--text-secondary)" }}
            >
              {post.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>{date}</span>
            <span>{post.readingTime}</span>
            {secondaryCategories.length > 0 && (
              <span>{secondaryCategories.join(" · ")}</span>
            )}
            <AvatarGroupOfCollaborators collaborators={post.collaborators} />
          </div>
        </div>

        {post.image ? (
          <Link
            href={getPostHref(post)}
            className="post-card-image-wrapper block border-t md:border-l md:border-t-0"
            style={{ borderColor: "var(--border-color)" }}
          >
            <OptimizedPostImage
              src={post.image}
              alt={post.imageAlt ?? post.title}
              width={post.imageWidth}
              height={post.imageHeight}
              lqip={post.imageLqip}
              sizes="(min-width: 768px) 240px, 100vw"
              wrapperClassName="h-full min-h-[220px]"
              imageClassName="post-card-image object-cover"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
