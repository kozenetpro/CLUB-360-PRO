import { notFound } from "next/navigation";
import TaxonomyPostsView from "@/components/pages/TaxonomyPostsView";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALES } from "@/i18n/locales";
import { getAllCategories, getCategoryNameBySlug, getPostsByCategory } from "@/lib/posts";
import { humanizeSlug, slugify } from "@/lib/utils";

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  LOCALES.filter((locale) => locale !== "en").forEach((lang) => {
    getAllCategories(lang).forEach((category) => {
      params.push({ lang, slug: slugify(category.name) });
      category.subcategories.forEach((subcategory) =>
        params.push({ lang, slug: slugify(subcategory.name) })
      );
    });
  });

  return params;
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
    title: `${dictionary.common.category}: ${getCategoryNameBySlug(slug, lang) ?? humanizeSlug(slug)}`,
  };
}

export default async function LocalizedCategoryPostsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getPostsByCategory(slug, lang);
  if (posts.length === 0) notFound();

  return (
    <TaxonomyPostsView
      locale={lang}
      posts={posts}
      title={getCategoryNameBySlug(slug, lang) ?? humanizeSlug(slug)}
    />
  );
}
