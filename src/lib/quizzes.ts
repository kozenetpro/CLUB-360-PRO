import { extractQuizBlocks, type ParsedQuizBlock } from "@/lib/quiz-blocks";
import { getAllPosts, getPostBySlug, type Post } from "@/lib/posts";
import { getPostHref, slugify } from "@/lib/utils";

export interface QuizItem extends ParsedQuizBlock {
  id: string;
  postSlug: string;
  postTitle: string;
  postHref: string;
  categories: string[];
}

export interface TrainingSet {
  id: string;
  title: string;
  description: string;
  postHref: string;
  postTitle: string;
  categories: string[];
  tags: string[];
  questions: QuizItem[];
}

function buildQuizItems(post: Post) {
  const blocks = extractQuizBlocks(post.content ?? "");

  return blocks.map((quiz, index): QuizItem => {
    const fallbackId = `${post.slug}-quiz-${index + 1}`;
    const id = quiz.id ? `${post.slug}-${quiz.id}` : fallbackId;

    return {
      ...quiz,
      id: slugify(id),
      postSlug: post.slug,
      postTitle: post.title,
      postHref: getPostHref(post),
      categories: post.categories,
      tags: [...new Set([...post.tags, ...quiz.tags])],
    };
  });
}

export function getTrainingSets(locale: string): TrainingSet[] {
  return getAllPosts()
    .filter((post) => post.lang === locale)
    .flatMap((postMeta) => {
      const post = getPostBySlug(postMeta.slug);
      if (!post) {
        return [];
      }

      const quizItems = buildQuizItems(post);

      if (quizItems.length === 0) {
        return [];
      }

      const tags = [...new Set(quizItems.flatMap((quiz) => quiz.tags))];

      return [
        {
          id: slugify(post.slug),
          title: post.title,
          description: post.description,
          postHref: getPostHref(post),
          postTitle: post.title,
          categories: post.categories,
          tags,
          questions: quizItems,
        },
      ];
    });
}
