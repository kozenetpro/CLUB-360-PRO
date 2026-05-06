import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localizePath } from "@/i18n/locales";
import type { PostMeta } from "@/lib/posts";
import { getPostHref } from "@/lib/utils";

export interface SearchTrainingSource {
  id: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  questionCount: number;
}

export interface SearchTrainingDocument {
  kind: "training";
  id: string;
  title: string;
  description: string;
  href: string;
  categories: string[];
  tags: string[];
  questionCount: number;
}

export interface SearchPostDocument extends PostMeta {
  kind: "post";
  href: string;
}

export type SearchDocument = SearchTrainingDocument | SearchPostDocument;

export function getSearchTrainings(
  locale: Locale,
  trainingSets: SearchTrainingSource[]
): SearchTrainingDocument[] {
  const dictionary = getDictionary(locale);

  return trainingSets.map((training) => ({
    kind: "training",
    id: training.id,
    title: training.title,
    description: training.description,
    href: localizePath(`/game?set=${encodeURIComponent(training.id)}`, locale),
    categories: training.categories,
    tags: [
      dictionary.nav.game,
      dictionary.game.kicker,
      dictionary.game.questions,
      dictionary.game.timer,
      String(training.questionCount),
      ...training.tags,
      ...dictionary.game.searchKeywords,
    ],
    questionCount: training.questionCount,
  }));
}

export function getSearchDocuments(
  posts: PostMeta[],
  locale: Locale,
  trainingSets: SearchTrainingSource[] = []
): SearchDocument[] {
  const postDocuments: SearchPostDocument[] = posts.map((post) => ({
    ...post,
    kind: "post",
    href: getPostHref(post),
  }));

  return [...getSearchTrainings(locale, trainingSets), ...postDocuments];
}
