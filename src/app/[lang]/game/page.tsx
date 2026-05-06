import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GamePage from "@/components/pages/GamePage";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALES, localizePath } from "@/i18n/locales";

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dictionary = getDictionary(lang);
  const url = `${siteConfig.siteUrl}${localizePath("/game", lang)}`;

  return {
    title: dictionary.game.title,
    description: dictionary.game.description,
    openGraph: {
      title: dictionary.game.title,
      description: dictionary.game.description,
      url,
      siteName: siteConfig.title,
      type: "website",
    },
  };
}

export default async function LocalizedGamePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ set?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const queryParams = await searchParams;

  return <GamePage locale={lang} initialSetId={queryParams.set} />;
}
