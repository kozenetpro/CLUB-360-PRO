import { notFound } from "next/navigation";
import HomeView from "@/components/pages/HomeView";
import { isLocale, LOCALES } from "@/i18n/locales";

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((lang) => ({ lang }));
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <HomeView locale={lang} />;
}
