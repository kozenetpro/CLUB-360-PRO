import Image from "next/image";
import { Bot, BookOpen, Cloud, Code2, Globe, Mail, Shield, Users, Briefcase, Play } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";

const AREA_ICONS = [Code2, BookOpen, Shield, Cloud, Bot, Users] as const;

const CONTACT_ICONS = {
  github: Code2,
  linkedin: Briefcase,
  website: Globe,
  mail: Mail,
  youtube: Play,
} as const;

interface AboutViewProps {
  locale: Locale;
}

export default function AboutView({ locale }: AboutViewProps) {
  const dictionary = getDictionary(locale);

  return (
    <div>
      <h1
        className="text-3xl font-bold mt-4 mb-6 animate-fade-in"
        style={{ color: "var(--text-primary)" }}
      >
        {dictionary.about.title}
      </h1>

      <div className="animate-fade-in space-y-8">
        <section
          className="rounded-xl border p-6"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-start gap-5">
            <Image
              src={siteConfig.avatar}
              alt={siteConfig.name}
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {siteConfig.name}
              </h2>
              <p
                className="mb-3 text-xs font-medium uppercase tracking-[0.16em]"
                style={{ color: "var(--text-muted)" }}
              >
                {dictionary.site.profileRole}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {dictionary.site.about.summary}
              </p>
              {dictionary.site.about.details.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed mt-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {dictionary.about.sectionTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {dictionary.about.areas.map((area, index) => {
              const Icon = AREA_ICONS[index] ?? Code2;

              return (
                <div
                  key={area.label}
                  className="rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
                  style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} style={{ color: "var(--accent)" }} />
                    <h3 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                      {area.label}
                    </h3>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {dictionary.about.contactTitle}
          </h2>
          <div className="flex gap-4 flex-wrap">
            {siteConfig.socialLinks
              .filter((link) => link.icon !== "rss")
              .map((link) => {
                const Icon = CONTACT_ICONS[link.icon as keyof typeof CONTACT_ICONS];

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Icon size={16} />
                    {link.label}
                  </a>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
