import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-1.5 text-sm mb-1 animate-fade-in"
      style={{ color: "var(--breadcrumb-text)" }}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:opacity-80"
        style={{ color: "var(--accent)" }}
      >
        <HomeIcon size={13} />
        <span>Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
