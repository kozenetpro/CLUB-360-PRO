import GameView from "@/components/pages/GameView";
import type { Locale } from "@/i18n/locales";
import { getTrainingSets } from "@/lib/quizzes";

interface GamePageProps {
  locale: Locale;
  initialSetId?: string;
}

export default function GamePage({ locale, initialSetId }: GamePageProps) {
  const trainingSets = getTrainingSets(locale);

  return <GameView locale={locale} trainingSets={trainingSets} initialSetId={initialSetId} />;
}
