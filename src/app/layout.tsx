import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import MainGrid from "@/components/layout/MainGrid";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { getAllPosts, getAllTags, getRecentPosts, type PostMeta } from "@/lib/posts";
import Topbar from "@/components/layout/Topbar";
import MermaidInitializer from "@/components/content/MermaidInitializer";
import RouteBodyClass from "@/components/layout/RouteBodyClass";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE, LOCALES, type Locale, localizePath } from "@/i18n/locales";
import ThemeInitScript from "@/components/theme/ThemeInitScript";
import { getPostHref } from "@/lib/utils";

const defaultDictionary = getDictionary(DEFAULT_LOCALE);

type PostLanguageHrefs = Record<string, Partial<Record<Locale, string>>>;
type LocalePosts = Record<Locale, PostMeta[]>;
type LocaleTags = Record<Locale, { name: string; count: number }[]>;

function getPostLanguageHrefs(): PostLanguageHrefs {
  const postsByTranslationKey = new Map<string, ReturnType<typeof getAllPosts>>();

  getAllPosts().forEach((post) => {
    if (!post.translationKey) {
      return;
    }

    const posts = postsByTranslationKey.get(post.translationKey) ?? [];
    posts.push(post);
    postsByTranslationKey.set(post.translationKey, posts);
  });

  const hrefs: PostLanguageHrefs = {};

  postsByTranslationKey.forEach((posts) => {
    posts.forEach((post) => {
      hrefs[post.slug] = Object.fromEntries(
        LOCALES.map((locale) => {
          const translatedPost = posts.find((candidate) => candidate.lang === locale);
          return [locale, translatedPost ? getPostHref(translatedPost) : localizePath("/", locale)];
        })
      );
    });
  });

  return hrefs;
}

function getRecentPostsByLocale(): LocalePosts {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, getRecentPosts(5, undefined, locale)])
  ) as LocalePosts;
}

function getTagsByLocale(): LocaleTags {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, getAllTags(locale).slice(0, 8)])
  ) as LocaleTags;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: defaultDictionary.site.description,
  manifest: "/favicon/site.webmanifest",
  keywords: [
    "aws",
    "terraform",
    "serverless",
    "cloud architecture",
    "generative ai",
    "marathon",
    "club pro",
  ],
  openGraph: {
    title: siteConfig.title,
    description: defaultDictionary.site.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.title,
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recentPostsByLocale = getRecentPostsByLocale();
  const tagsByLocale = getTagsByLocale();
  const postLanguageHrefs = getPostLanguageHrefs();

  return (
    <html
      lang="en"
      className="h-full dark"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <ThemeInitScript />
      </head>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <MainGrid>
          <Sidebar postLanguageHrefs={postLanguageHrefs} />

          <div className="min-w-0 flex min-h-screen flex-col">
            <Topbar />
            <div className="app-content-wrap flex flex-1 min-h-0 justify-center">
              <div className="app-content-frame flex min-w-0 max-w-6xl flex-1">
                <main className="app-main min-w-0 flex-1 px-6 pt-6 pb-4 lg:px-8">
                  {children}
                </main>
                <RightPanel recentPostsByLocale={recentPostsByLocale} tagsByLocale={tagsByLocale} />
              </div>
            </div>
            <Footer />
          </div>
        </MainGrid>
        <RouteBodyClass />
        <MermaidInitializer />
      </body>
    </html>
  );
}
