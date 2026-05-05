import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getAllPosts } from "@/lib/posts";
import { getPostHref } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static"; // Generate at build time

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const dictionary = getDictionary(DEFAULT_LOCALE);
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${siteConfig.siteUrl}${getPostHref(post)}</link>
          <guid>${siteConfig.siteUrl}${getPostHref(post)}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${escapeXml(post.description)}</description>
        </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${siteConfig.siteUrl}</link>
    <description>${escapeXml(dictionary.site.description)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
