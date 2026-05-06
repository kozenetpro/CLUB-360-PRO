import { notFound } from "next/navigation";
import SearchResultsClient from "@/components/search/SearchResultsClient";
import { isLocale } from "@/i18n/locales";
import { getTrainingSets } from "@/lib/quizzes";
import { getSerializablePosts } from "@/lib/serializable-posts";

export default async function LocalizedSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const queryParams = await searchParams;
  const query = queryParams.q || "";
  const posts = getSerializablePosts(lang);
  const trainingSets = getTrainingSets(lang).map((set) => ({
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
      locale={lang}
      trainingSets={trainingSets}
    />
  );
}
