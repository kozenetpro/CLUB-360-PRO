import type { Metadata } from "next";
import GamePage from "@/components/pages/GamePage";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dictionary.game.title,
  description: dictionary.game.description,
  openGraph: {
    title: dictionary.game.title,
    description: dictionary.game.description,
    url: `${siteConfig.siteUrl}/game`,
    siteName: siteConfig.title,
    type: "website",
  },
};

export default async function DefaultGamePage({
  searchParams,
}: {
  searchParams: Promise<{ set?: string }>;
}) {
  const params = await searchParams;

  return <GamePage locale={DEFAULT_LOCALE} initialSetId={params.set} />;
}
