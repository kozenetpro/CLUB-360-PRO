import ArchivesView from "@/components/pages/ArchivesView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata = { title: dictionary.nav.archives };

export default function ArchivesPage() {
  return <ArchivesView locale={DEFAULT_LOCALE} />;
}
