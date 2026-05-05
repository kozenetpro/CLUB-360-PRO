import HomeView from "@/components/pages/HomeView";
import { DEFAULT_LOCALE } from "@/i18n/locales";

export default function HomePage() {
  return <HomeView locale={DEFAULT_LOCALE} />;
}
