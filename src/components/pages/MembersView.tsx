import { CardOfCollaborators } from "@/components/ui/AvatarGroupOfCollaborators";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { getAllCollaborators } from "@/lib/posts";

interface MembersViewProps {
  locale: Locale;
}

export default function MembersView({ locale }: MembersViewProps) {
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-4">
      <div
        className="hero-card rounded-2xl border p-5 animate-fade-in sm:p-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <p
          className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-muted)" }}
        >
          {dictionary.members.kicker}
        </p>
        <p
          className="text-sm leading-7"
          style={{ color: "var(--text-secondary)" }}
        >
          {dictionary.members.description}
        </p>
      </div>

      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {getAllCollaborators().map((collaborator) => (
          <CardOfCollaborators key={collaborator.name} collaborator={collaborator} />
        ))}
      </div>
    </div>
  );
}
