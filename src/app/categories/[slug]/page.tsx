import { notFound } from "next/navigation";
import TaxonomyPostsView from "@/components/pages/TaxonomyPostsView";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getAllCategories, getCategoryNameBySlug, getPostsByCategory } from "@/lib/posts";
import { humanizeSlug, slugify } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];

  getAllCategories(DEFAULT_LOCALE).forEach((category) => {
    slugs.push({ slug: slugify(category.name) });
    category.subcategories.forEach((subcategory) => slugs.push({ slug: slugify(subcategory.name) }));
  });

  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `Category: ${getCategoryNameBySlug(slug, DEFAULT_LOCALE) ?? humanizeSlug(slug)}` };
}

export default async function CategoryPostsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPostsByCategory(slug, DEFAULT_LOCALE);
  if (posts.length === 0) notFound();

  return (
    <TaxonomyPostsView
      locale={DEFAULT_LOCALE}
      posts={posts}
      title={getCategoryNameBySlug(slug, DEFAULT_LOCALE) ?? humanizeSlug(slug)}
    />
  );
}
