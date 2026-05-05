import SearchResultsClient from "@/components/search/SearchResultsClient";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getSerializablePosts } from "@/lib/serializable-posts";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const posts = getSerializablePosts(DEFAULT_LOCALE);

  return <SearchResultsClient query={query} posts={posts} locale={DEFAULT_LOCALE} />;
}
