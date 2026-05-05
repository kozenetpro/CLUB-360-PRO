import TagBadge from "@/components/ui/TagBadge";

interface TrendingTagsSectionProps {
  tags: { name: string; count: number }[];
  heading: string;
  locale: "en" | "pt";
}

export default function TrendingTagsSection({ tags, heading, locale }: TrendingTagsSectionProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section className="panel-section">
      <h3 className="panel-heading">{heading}</h3>
      <div className="flex flex-wrap gap-2 pt-3">
        {tags.slice(0, 10).map((tag) => (
          <TagBadge key={tag.name} name={tag.name} count={tag.count} size="sm" locale={locale} />
        ))}
      </div>
    </section>
  );
}
