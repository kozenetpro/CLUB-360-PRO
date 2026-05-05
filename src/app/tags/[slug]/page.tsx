import { notFound } from "next/navigation";
import TaxonomyPostsView from "@/components/pages/TaxonomyPostsView";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getAllTags, getPostsByTag, getTagNameBySlug } from "@/lib/posts";
import { humanizeSlug, slugify } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllTags(DEFAULT_LOCALE).map((tag) => ({ slug: slugify(tag.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Tag: ${getTagNameBySlug(slug, DEFAULT_LOCALE) ?? humanizeSlug(slug)}` };
}

export default async function TagPostsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPostsByTag(slug, DEFAULT_LOCALE);
  if (posts.length === 0) notFound();

  return (
    <TaxonomyPostsView
      locale={DEFAULT_LOCALE}
      posts={posts}
      title={getTagNameBySlug(slug, DEFAULT_LOCALE) ?? humanizeSlug(slug)}
      prefix="#"
    />
  );
}
