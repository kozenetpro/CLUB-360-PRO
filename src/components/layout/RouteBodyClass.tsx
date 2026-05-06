"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocaleFromPathname } from "@/i18n/locales";

export default function RouteBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPathname = stripLocaleFromPathname(pathname);
    const routeKind = normalizedPathname === "/game" ? "game" : "default";

    document.body.dataset.routeKind = routeKind;

    return () => {
      if (document.body.dataset.routeKind === routeKind) {
        delete document.body.dataset.routeKind;
      }

      delete document.body.dataset.gameMode;
    };
  }, [pathname]);

  return null;
}
