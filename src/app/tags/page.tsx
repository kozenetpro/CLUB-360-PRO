import TagsView from "@/components/pages/TagsView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata = { title: dictionary.nav.tags };

export default function TagsPage() {
  return <TagsView locale={DEFAULT_LOCALE} />;
}
