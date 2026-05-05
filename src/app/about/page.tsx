import AboutView from "@/components/pages/AboutView";
import { getDictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata = { title: dictionary.about.title };

export default function AboutPage() {
  return <AboutView locale={DEFAULT_LOCALE} />;
}
