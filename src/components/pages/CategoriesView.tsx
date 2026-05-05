import Link from "next/link";
import { ChevronDown, FolderOpen } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { localizePath } from "@/i18n/locales";
import { getAllCategories } from "@/lib/posts";
import { slugify } from "@/lib/utils";

interface CategoriesViewProps {
  locale: Locale;
}

export default function CategoriesView({ locale }: CategoriesViewProps) {
  const dictionary = getDictionary(locale);
  const categories = getAllCategories(locale);

  return (
    <div>
      <h1
        className="text-3xl font-bold mt-4 mb-8 animate-fade-in"
        style={{ color: "var(--text-primary)" }}
      >
        {dictionary.nav.categories}
      </h1>

      <div className="space-y-1 animate-fade-in">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="rounded-lg border overflow-hidden"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <FolderOpen size={16} style={{ color: "var(--text-muted)" }} />
                <Link
                  href={localizePath(`/categories/${slugify(cat.name)}`, locale)}
                  className="font-medium text-sm hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {cat.name}
                </Link>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {cat.subcategories.length > 0
                    ? `${cat.subcategories.length} ${dictionary.nav.categories.toLowerCase()}, ${cat.count} ${dictionary.common.posts}`
                    : `${cat.count} ${dictionary.common.posts}`}
                </span>
              </div>
              {cat.subcategories.length > 0 && (
                <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
              )}
            </div>

            {cat.subcategories.length > 0 && (
              <div
                className="border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center gap-3 px-5 py-2.5 pl-12"
                  >
                    <FolderOpen size={14} style={{ color: "var(--text-muted)" }} />
                    <Link
                      href={localizePath(`/categories/${slugify(sub.name)}`, locale)}
                      className="text-sm hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      {sub.name}
                    </Link>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {sub.count} {dictionary.common.posts}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
