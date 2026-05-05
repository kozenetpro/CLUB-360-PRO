import CategoriesView from "@/components/pages/CategoriesView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata = { title: dictionary.nav.categories };

export default function CategoriesPage() {
  return <CategoriesView locale={DEFAULT_LOCALE} />;
}
