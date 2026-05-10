import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slugify } from "@/lib/utils";

type FrontmatterImage =
  | string
  | {
      path?: string;
      alt?: string;
      lqip?: string;
      width?: number;
      height?: number;
    };

export interface PostMeta {
  slug: string;
  lang: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  description: string;
  image?: string;
  imageAlt?: string;
  imageLqip?: string;
  imageWidth?: number;
  imageHeight?: number;
  mermaid?: boolean;
  pin?: boolean;
  aiGenerated?: boolean;
  readingTime: string;
  lastModified?: string;
  translationKey?: string;
  collaborators: Collaborator[];
}

export interface Post extends PostMeta {
  content: string;
}

export interface Collaborator {
  src: string;
  name: string;
}

const POSTS_DIR = path.join(process.cwd(), "src/_posts");
const LANGUAGE_DIR_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/;

function getSupportedLanguages() {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && LANGUAGE_DIR_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

export function isSupportedLanguage(lang: string) {
  return getSupportedLanguages().includes(lang);
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toDateString(value: unknown) {
  const date = typeof value === "string" || value instanceof Date ? new Date(value) : new Date();

  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function getCollaborators(data: Record<string, unknown>): Collaborator[] {
  const raw = data.collaborators;

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      "name" in item &&
      "src" in item &&
      typeof item.name === "string" &&
      typeof item.src === "string"
    ) {
      return [{ name: item.name, src: item.src }];
    }

    return [];
  });
}

function resolveImage(image: FrontmatterImage | undefined) {
  if (!image) {
    return {
      image: undefined,
      imageAlt: undefined,
      imageLqip: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
    };
  }

  if (typeof image === "string") {
    return {
      image,
      imageAlt: undefined,
      imageLqip: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
    };
  }

  const parsedWidth = Number(image.width);
  const parsedHeight = Number(image.height);
  const imageWidth = Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : undefined;
  const imageHeight = Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : undefined;

  return {
    image: image.path,
    imageAlt: image.alt,
    imageLqip: image.lqip,
    imageWidth,
    imageHeight,
  };
}

function getPostFiles() {
  const postFiles: { filename: string; lang: string }[] = [];

  getSupportedLanguages().forEach((lang) => {
    const langDir = path.join(POSTS_DIR, lang);
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
      files.forEach((filename) => {
        postFiles.push({ filename, lang });
      });
    }
  });

  return postFiles;
}

export function getAllPosts(): PostMeta[] {
  const files = getPostFiles();

  const posts = files.map(({ filename, lang }) => {
    const baseSlug = filename.replace(/\.(md|mdx)$/, "");
    const slug = `${lang}/${baseSlug}`;
    const filePath = path.join(POSTS_DIR, lang, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);
    const collaborators = getCollaborators(data);
    const { image, imageAlt, imageLqip, imageWidth, imageHeight } = resolveImage(
      data.image as FrontmatterImage | undefined
    );

    return {
      slug,
      lang,
      title: typeof data.title === "string" ? data.title : baseSlug,
      date: toDateString(data.date),
      categories: toStringArray(data.categories),
      tags: toStringArray(data.tags),
      description: typeof data.description === "string" ? data.description : `${content.slice(0, 160)}...`,
      image,
      imageAlt,
      imageLqip,
      imageWidth,
      imageHeight,
      mermaid: Boolean(data.mermaid),
      pin: Boolean(data.pin),
      aiGenerated: Boolean(data.aiGenerated),
      readingTime: stats.text,
      lastModified: data.lastModified ? toDateString(data.lastModified) : toDateString(data.date),
      translationKey: typeof data.translationKey === "string" ? data.translationKey : undefined,
      collaborators,
    } as PostMeta;
  });

  // Pinned first, then sort by date descending
  return posts.sort((a, b) => {
    if (a.pin && !b.pin) return -1;
    if (!a.pin && b.pin) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  // Slug format: "en/post-name", "pt/post-name", etc.
  const [lang, ...postNameParts] = slug.split("/");
  const postName = postNameParts.join("/");

  if (!postName || !isSupportedLanguage(lang)) {
    return null;
  }

  const langDir = path.join(POSTS_DIR, lang);
  const filePath = [path.join(langDir, `${postName}.mdx`), path.join(langDir, `${postName}.md`)].find(
    (candidate) => fs.existsSync(candidate)
  );

  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);
  const collaborators = getCollaborators(data);
  const { image, imageAlt, imageLqip, imageWidth, imageHeight } = resolveImage(
    data.image as FrontmatterImage | undefined
  );

  return {
    slug,
    lang,
    title: typeof data.title === "string" ? data.title : postName,
    date: toDateString(data.date),
    categories: toStringArray(data.categories),
    tags: toStringArray(data.tags),
    description: typeof data.description === "string" ? data.description : `${content.slice(0, 160)}...`,
    image,
    imageAlt,
    imageLqip,
    imageWidth,
    imageHeight,
    mermaid: Boolean(data.mermaid),
    pin: Boolean(data.pin),
    aiGenerated: Boolean(data.aiGenerated),
    readingTime: stats.text,
    lastModified: data.lastModified ? toDateString(data.lastModified) : toDateString(data.date),
    translationKey: typeof data.translationKey === "string" ? data.translationKey : undefined,
    collaborators,
    content,

  };
}

export function getPostSlugByTranslationKey(translationKey: string, lang: string) {
  return getAllPosts().find(
    (post) => post.lang === lang && post.translationKey === translationKey
  )?.slug;
}

export function getAllCategories(lang?: string): { name: string; count: number; subcategories: { name: string; count: number }[] }[] {
  const posts = getAllPosts().filter((post) => !lang || post.lang === lang);
  const catMap = new Map<string, Set<string>>();
  const catCount = new Map<string, number>();

  posts.forEach((post) => {
    if (post.categories.length > 0) {
      const parent = post.categories[0];
      catCount.set(parent, (catCount.get(parent) || 0) + 1);
      if (!catMap.has(parent)) catMap.set(parent, new Set());
      if (post.categories.length > 1) {
        post.categories.slice(1).forEach((sub) => {
          catMap.get(parent)!.add(sub);
        });
      }
    }
  });

  return Array.from(catMap.entries())
    .map(([name, subs]) => {
      const subcategories = Array.from(subs)
        .map((sub) => ({
          name: sub,
          count: posts.filter((p) => p.categories.includes(sub)).length,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return { name, count: catCount.get(name) || 0, subcategories };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllTags(lang?: string): { name: string; count: number }[] {
  const posts = getAllPosts().filter((post) => !lang || post.lang === lang);
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(category: string, lang?: string): PostMeta[] {
  return getAllPosts().filter((p) =>
    (!lang || p.lang === lang) &&
    p.categories.some(
      (c) => c.toLowerCase() === category.toLowerCase() || slugify(c) === category
    )
  );
}

export function getPostsByTag(tag: string, lang?: string): PostMeta[] {
  return getAllPosts().filter((p) =>
    (!lang || p.lang === lang) &&
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase() || slugify(t) === tag)
  );
}

export function getCategoryNameBySlug(slug: string, lang?: string): string | null {
  const categories = new Set<string>();

  getAllPosts().filter((post) => !lang || post.lang === lang).forEach((post) => {
    post.categories.forEach((category) => categories.add(category));
  });

  return Array.from(categories).find((category) => slugify(category) === slug) ?? null;
}

export function getTagNameBySlug(slug: string, lang?: string): string | null {
  const tags = new Set<string>();

  getAllPosts().filter((post) => !lang || post.lang === lang).forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).find((tag) => slugify(tag) === slug) ?? null;
}

export function getRecentPosts(count = 4, excludeSlug?: string, lang?: string): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.slug !== excludeSlug && (!lang || post.lang === lang))
    .sort((a, b) => new Date(b.lastModified || b.date).getTime() - new Date(a.lastModified || a.date).getTime())
    .slice(0, count);
}


export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getAllCollaborators() {
  const posts = getAllPosts();
  const collaborators = new Map<string, Collaborator>();
  posts.forEach((post) => {
    post.collaborators.forEach((collaborator) => collaborators.set(collaborator.name, collaborator));
  });
  return Array.from(collaborators.values()).sort((a, b) => a.name.localeCompare(b.name));
}
