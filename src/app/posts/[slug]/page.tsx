import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, FolderOpen, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { compileMdxContent } from "@/lib/mdx";
import TagBadge from "@/components/ui/TagBadge";
import OptimizedPostImage from "@/components/posts/OptimizedPostImage";
import ArticleShare from "@/components/posts/ArticleShare";
import { buildPostMetadata, getAbsoluteUrl } from "@/lib/post-metadata";
import { DEFAULT_POST_LANG, formatDate, getPostHref, slugify, splitPostSlug } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { AvatarGroupOfCollaborators } from "@/components/ui/AvatarGroupOfCollaborators";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE, localizePath } from "@/i18n/locales";

export async function generateStaticParams() {
  return getAllPosts()
    .filter((post) => post.lang === DEFAULT_POST_LANG)
    .map((post) => ({ slug: splitPostSlug(post.slug).slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(`${DEFAULT_POST_LANG}/${slug}`);
  if (!post) return {};
  return buildPostMetadata(post);
}

function getAdjacentPostsForLanguage(slug: string, lang: string) {
  const posts = getAllPosts().filter((post) => post.lang === lang);
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fullSlug = `${DEFAULT_POST_LANG}/${slug}`;
  const post = getPostBySlug(fullSlug);
  if (!post) notFound();

  const content = await compileMdxContent(post.content, { title: post.title });
  const dictionary = getDictionary(DEFAULT_LOCALE);
  const { prev, next } = getAdjacentPostsForLanguage(fullSlug, DEFAULT_POST_LANG);
  const postUrl = getAbsoluteUrl(getPostHref(post));

  const date = formatDate(post.date, "long", DEFAULT_LOCALE);
  const lastModified =
    post.lastModified && post.lastModified !== post.date
      ? formatDate(post.lastModified, "long", DEFAULT_LOCALE)
      : null;

  return (
    <div className="post-layout">
      <div className="post-main min-w-0">
        <header
          className="post-header mt-4 animate-fade-in border-b pb-8"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center justify-between">
          <p className="post-kicker">{dictionary.common.post}</p>
          <AvatarGroupOfCollaborators collaborators={post.collaborators} />
          </div>

          <h1
            className="mb-4 text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            {post.title}
          </h1>

          {post.description ? (
            <p className="max-w-3xl text-base leading-8 sm:text-[1.05rem]" style={{ color: "var(--text-secondary)" }}>
              {post.description}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {dictionary.common.posted} {date}
            </span>
            <span>{dictionary.common.by} {siteConfig.name}</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {post.readingTime}
            </span>
            {lastModified ? (
              <span className="flex items-center gap-1.5">
                <RefreshCcw size={14} /> {dictionary.common.updated} {lastModified}
              </span>
            ) : null}
            {post.categories.length > 0 && (
              <span className="flex items-center gap-1.5">
                <FolderOpen size={14} />
                {post.categories.map((cat, i) => (
                  <span key={cat}>
                    <Link
                      href={localizePath(`/categories/${slugify(cat)}`, DEFAULT_LOCALE)}
                      className="hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      {cat}
                    </Link>
                    {i < post.categories.length - 1 && ", "}
                  </span>
                ))}
              </span>
            )}
          </div>

          {post.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <TagBadge key={tag} name={tag} size="sm" locale={DEFAULT_LOCALE} /> 
              ))}
            </div>
          ) : null}

          <ArticleShare title={post.title} url={postUrl} />

          {post.image ? (
            <div
              className="post-cover mt-6 overflow-hidden rounded-2xl border animate-fade-in"
              style={{ borderColor: "var(--border-color)" }}
            >
              <OptimizedPostImage
                src={post.image}
                alt={post.imageAlt ?? post.title}
                width={post.imageWidth}
                height={post.imageHeight}
                lqip={post.imageLqip}
                sizes="(min-width: 1280px) 820px, (min-width: 768px) calc(100vw - 420px), 100vw"
                priority
                imageClassName="object-cover"
              />
            </div>
          ) : null}

        </header>

        <article className="post-prose mt-8 max-w-none animate-fade-in">
          {content}
        </article>

        <hr className="my-10" style={{ borderColor: "var(--border-color)" }} />

        <nav className="grid gap-4 pb-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={getPostHref(prev)}
              className="post-nav-link group"
            >
              <span className="post-nav-label">
                <ChevronLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                {dictionary.common.previousArticle}
              </span>
              <span className="post-nav-title">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              href={getPostHref(next)}
              className="post-nav-link group text-left sm:text-right"
            >
              <span className="post-nav-label justify-start sm:justify-end">
                {dictionary.common.nextArticle}
                <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
              <span className="post-nav-title">{next.title}</span>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </div>
  );
}
