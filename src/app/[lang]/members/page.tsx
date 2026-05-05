import { notFound } from "next/navigation";
import MembersView from "@/components/pages/MembersView";
import { isLocale, LOCALES } from "@/i18n/locales";

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((lang) => ({ lang }));
}

export default async function LocalizedMembersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <MembersView locale={lang} />;
}
