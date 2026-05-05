"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_EVENT = "rjs-theme-change";

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return true;
  }

  const stored = localStorage.getItem("theme");
  return stored !== "light";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener(THEME_EVENT, onStoreChange);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getThemeSnapshot, () => true);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-1.5 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
      style={{ color: "var(--text-muted)" }}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
