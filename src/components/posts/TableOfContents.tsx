"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className="toc-link block border-l-2 py-1 text-xs transition-colors duration-200"
          style={{
            paddingLeft: h.level === 3 ? "1.5rem" : "0.75rem",
            color: activeId === h.id ? "var(--accent)" : "var(--text-muted)",
            borderColor: activeId === h.id ? "var(--accent)" : "transparent",
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
