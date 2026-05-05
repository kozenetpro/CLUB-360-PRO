import Link from "next/link";
import { DEFAULT_LOCALE, type Locale, localizePath } from "@/i18n/locales";
import { slugify } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  count?: number;
  size?: "sm" | "md";
  locale?: Locale;
}

export default function TagBadge({ name, count, size = "md", locale = DEFAULT_LOCALE }: TagBadgeProps) {
  const slug = slugify(name);
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <Link
      href={localizePath(`/tags/${slug}`, locale)}
      className={`post-tag inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 hover:scale-105 ${padding}`}
      style={{
        background: "var(--tag-bg)",
        borderColor: "var(--tag-border)",
        color: "var(--text-secondary)",
      }}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
