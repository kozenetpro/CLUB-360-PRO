import { getAllPosts, type PostMeta } from "@/lib/posts";

export function getSerializablePosts(lang: string): PostMeta[] {
  return getAllPosts().filter((post) => post.lang === lang).map((post): PostMeta => ({
    slug: String(post.slug || ""),
    lang: String(post.lang || "en"),
    title: String(post.title || "Untitled"),
    date: String(post.date || new Date().toISOString()),
    categories: (Array.isArray(post.categories) ? post.categories : []).filter(
      (category): category is string => typeof category === "string"
    ),
    tags: (Array.isArray(post.tags) ? post.tags : []).filter(
      (tag): tag is string => typeof tag === "string"
    ),
    description: String(post.description || ""),
    image: typeof post.image === "string" ? post.image : undefined,
    imageAlt: typeof post.imageAlt === "string" ? post.imageAlt : undefined,
    imageLqip: typeof post.imageLqip === "string" ? post.imageLqip : undefined,
    imageWidth: typeof post.imageWidth === "number" ? post.imageWidth : undefined,
    imageHeight: typeof post.imageHeight === "number" ? post.imageHeight : undefined,
    mermaid: Boolean(post.mermaid),
    pin: Boolean(post.pin),
    aiGenerated: Boolean(post.aiGenerated),
    readingTime: String(post.readingTime || "1 min read"),
    lastModified: typeof post.lastModified === "string" ? post.lastModified : undefined,
    translationKey: typeof post.translationKey === "string" ? post.translationKey : undefined,
    collaborators: Array.isArray(post.collaborators) ? post.collaborators : [],
  }));
}
