"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  Tags,
  Archive,
  User,
  Code2,
  Briefcase,
  Globe,
  Mail,
  Rss,
  Menu,
  X,
  Users,
  PlayCircle,
  Gamepad2,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";
import { siteConfig, siteRoutes, type SiteSocialIcon } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocaleFromPathname, LOCALES, type Locale, localizePath, stripLocaleFromPathname } from "@/i18n/locales";
import { getPostSlugFromPathname } from "@/lib/utils";

const NAV_ICONS = {
  [siteRoutes.home]: Home,
  [siteRoutes.categories]: FolderOpen,
  [siteRoutes.tags]: Tags,
  [siteRoutes.game]: Gamepad2,
  [siteRoutes.archives]: Archive,
  [siteRoutes.members]: Users,
  [siteRoutes.about]: User,
} as const;

const SOCIAL_ICONS: Record<SiteSocialIcon, typeof Code2> = {
  github: Code2,
  linkedin: Briefcase,
  website: Globe,
  mail: Mail,
  rss: Rss,
  youtube: PlayCircle
};

interface SidebarProps {
  postLanguageHrefs?: Record<string, Partial<Record<Locale, string>>>;
}

export default function Sidebar({ postLanguageHrefs }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);
  const normalizedPathname = stripLocaleFromPathname(pathname);

  const navItems = [
    { href: siteRoutes.home, label: dictionary.nav.home },
    { href: siteRoutes.members, label: dictionary.nav.members },
    { href: siteRoutes.game, label: dictionary.nav.game },
    { href: siteRoutes.categories, label: dictionary.nav.categories },
    { href: siteRoutes.tags, label: dictionary.nav.tags },
    { href: siteRoutes.archives, label: dictionary.nav.archives },
    { href: siteRoutes.about, label: dictionary.nav.about },
  ];

  const isActive = (href: string) => {
    if (href === "/") return normalizedPathname === "/";
    return normalizedPathname.startsWith(href);
  };

  const getLanguageSwitchHref = (nextLocale: Locale) => {
    const postSlug = getPostSlugFromPathname(pathname);

    if (!postSlug) {
      return localizePath(pathname, nextLocale);
    }

    return postLanguageHrefs?.[postSlug]?.[nextLocale] ?? localizePath("/", nextLocale);
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed left-4 top-2.5 z-50 rounded-lg p-2 lg:hidden"
        style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "var(--overlay-bg)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh flex-col overflow-y-auto overscroll-contain
          transition-transform duration-300 lg:sticky lg:top-0 lg:z-0 lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          width: "var(--sidebar-width)",
          background: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        {/* Close button (mobile) */}
        <button
          className="absolute top-4 right-4 p-1 lg:hidden"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* Avatar & Title */}
        <div className="flex flex-col items-center px-4 pb-4 pt-10 text-center lg:pb-6">
          <Link href="/" onClick={() => setMobileOpen(false)} className="sidebar-avatar">
            <Image
              src={siteConfig.avatar}
              alt={siteConfig.name}
              width={112}
              height={112}
              priority
              className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
            />
          </Link>
          <div className="mt-3 space-y-1.5 lg:mt-4">
            <h1 className="text-lg font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
              {siteConfig.name}
            </h1>
            <p className="text-xs italic leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {dictionary.site.shortRole}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 space-y-1 px-3 lg:mt-3 lg:space-y-1.5">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={localizePath(item.href, locale)}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 lg:py-2.5"
                style={{
                  color: active ? "var(--sidebar-active-color)" : "var(--text-secondary)",
                  background: active ? "var(--nav-active-bg)" : "transparent",
                  borderLeft: active ? "3px solid var(--nav-active-border)" : "3px solid transparent",
                }}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section: theme toggle + social */}
        <div className="mt-auto px-4 pb-4 pt-4 lg:pb-6">
          <div className="mb-3 flex justify-center gap-2 lg:mb-4">
            {LOCALES.map((nextLocale) => (
              <Link
                key={nextLocale}
                href={getLanguageSwitchHref(nextLocale)}
                className="rounded-md border px-2 py-1 text-[11px] font-semibold uppercase transition-colors"
                style={{
                  borderColor: "var(--border-color)",
                  color: nextLocale === locale ? "var(--sidebar-active-color)" : "var(--text-muted)",
                  background: nextLocale === locale ? "var(--nav-active-bg)" : "transparent",
                }}
              >
                {nextLocale}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 border-t pt-4" style={{ borderColor: "var(--border-color)" }}>
            <ThemeToggle />
            <span style={{ color: "var(--border-color)" }}>·</span>
            {siteConfig.socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.icon];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={link.label}
                  className="transition-all duration-200 hover:scale-110"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
