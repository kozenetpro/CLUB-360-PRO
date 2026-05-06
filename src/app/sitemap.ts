import type { MetadataRoute } from "next";
import { siteConfig, siteRoutes } from "@/config/site";
import { LOCALES, localizePath } from "@/i18n/locales";
import { getAllPosts } from "@/lib/posts";
import { getPostHref } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.siteUrl}${getPostHref(post)}`,
    lastModified: post.lastModified || post.date,
    changeFrequency: "weekly" as const,
    priority: post.pin ? 0.9 : 0.7,
  }));

  const now = new Date().toISOString();
  const routePriorities = {
    [siteRoutes.home]: 1,
    [siteRoutes.about]: 0.6,
    [siteRoutes.game]: 0.8,
    [siteRoutes.categories]: 0.7,
    [siteRoutes.tags]: 0.7,
    [siteRoutes.archives]: 0.6,
    [siteRoutes.members]: 0.6,
  };

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    Object.entries(routePriorities).map(([pathname, priority]) => ({
      url: `${siteConfig.siteUrl}${localizePath(pathname, locale) === "/" ? "" : localizePath(pathname, locale)}`,
      lastModified: now,
      changeFrequency: pathname === siteRoutes.about || pathname === siteRoutes.members ? "monthly" as const : "weekly" as const,
      priority,
    }))
  );

  return [...staticRoutes, ...posts];
}
