import { notFound } from "next/navigation";
import TaxonomyPostsView from "@/components/pages/TaxonomyPostsView";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALES } from "@/i18n/locales";
import { getAllTags, getPostsByTag, getTagNameBySlug } from "@/lib/posts";
import { humanizeSlug, slugify } from "@/lib/utils";

export async function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").flatMap((lang) =>
    getAllTags(lang).map((tag) => ({ lang, slug: slugify(tag.name) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const dictionary = getDictionary(lang);
  return {
    title: `${dictionary.common.tag}: ${getTagNameBySlug(slug, lang) ?? humanizeSlug(slug)}`,
  };
}

export default async function LocalizedTagPostsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getPostsByTag(slug, lang);
  if (posts.length === 0) notFound();

  return (
    <TaxonomyPostsView
      locale={lang}
      posts={posts}
      title={getTagNameBySlug(slug, lang) ?? humanizeSlug(slug)}
      prefix="#"
    />
  );
}
