import SearchResultsClient from "@/components/search/SearchResultsClient";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getTrainingSets } from "@/lib/quizzes";
import { getSerializablePosts } from "@/lib/serializable-posts";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const posts = getSerializablePosts(DEFAULT_LOCALE);
  const trainingSets = getTrainingSets(DEFAULT_LOCALE).map((set) => ({
    id: set.id,
    title: set.title,
    description: set.description,
    categories: set.categories,
    tags: set.tags,
    questionCount: set.questions.length,
  }));

  return (
    <SearchResultsClient
      query={query}
      posts={posts}
      locale={DEFAULT_LOCALE}
      trainingSets={trainingSets}
    />
  );
}
