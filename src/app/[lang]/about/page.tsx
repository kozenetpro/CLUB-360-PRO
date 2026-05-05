import { notFound } from "next/navigation";
import AboutView from "@/components/pages/AboutView";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALES } from "@/i18n/locales";

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return { title: getDictionary(lang).about.title };
}

export default async function LocalizedAboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <AboutView locale={lang} />;
}
