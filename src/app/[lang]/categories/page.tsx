import { notFound } from "next/navigation";
import CategoriesView from "@/components/pages/CategoriesView";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALES } from "@/i18n/locales";

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return { title: getDictionary(lang).nav.categories };
}

export default async function LocalizedCategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <CategoriesView locale={lang} />;
}
