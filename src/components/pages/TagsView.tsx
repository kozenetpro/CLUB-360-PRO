import TagBadge from "@/components/ui/TagBadge";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { getAllTags } from "@/lib/posts";

interface TagsViewProps {
  locale: Locale;
}

export default function TagsView({ locale }: TagsViewProps) {
  const dictionary = getDictionary(locale);
  const tags = getAllTags(locale);

  return (
    <div>
      <h1
        className="text-3xl font-bold mt-4 mb-8 animate-fade-in"
        style={{ color: "var(--text-primary)" }}
      >
        {dictionary.nav.tags}
      </h1>

      <div className="flex flex-wrap gap-3 animate-fade-in">
        {tags.map((tag) => (
          <TagBadge key={tag.name} name={tag.name} count={tag.count} locale={locale} />
        ))}
      </div>
    </div>
  );
}
