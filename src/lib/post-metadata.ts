import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { PostMeta } from "@/lib/posts";
import { getPostHref } from "@/lib/utils";

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  en: "en_US",
  pt: "pt_BR",
};

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.siteUrl).toString();
}

export function getPostPreviewImagePath(post: Pick<PostMeta, "slug" | "lang">) {
  return `${getPostHref(post)}/opengraph-image`;
}

export function buildPostMetadata(post: PostMeta): Metadata {
  const pathname = getPostHref(post);
  const canonicalUrl = getAbsoluteUrl(pathname);
  const previewImageUrl = getAbsoluteUrl(getPostPreviewImagePath(post));
  const publishedTime = new Date(post.date).toISOString();
  const modifiedTime = new Date(post.lastModified || post.date).toISOString();

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: pathname,
    },
    authors: [
      {
        name: siteConfig.name,
        url: siteConfig.siteUrl,
      },
    ],
    category: post.categories[0],
    keywords: [...post.categories, ...post.tags, siteConfig.name],
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.description,
      siteName: siteConfig.title,
      locale: OPEN_GRAPH_LOCALES[post.lang] ?? "en_US",
      publishedTime,
      modifiedTime,
      authors: [siteConfig.name],
      section: post.categories[0],
      tags: post.tags,
      images: [
        {
          url: previewImageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} preview card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [previewImageUrl],
    },
  };
}
