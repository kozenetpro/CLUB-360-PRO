import { notFound } from "next/navigation";
import ArchivesView from "@/components/pages/ArchivesView";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALES } from "@/i18n/locales";

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return { title: getDictionary(lang).nav.archives };
}

export default async function LocalizedArchivesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <ArchivesView locale={lang} />;
}
