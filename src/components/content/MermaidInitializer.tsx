"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      run: (config?: Record<string, unknown>) => Promise<void> | void;
    };
    __rjsMermaidLoader?: Promise<void>;
  }
}

const MERMAID_SCRIPT_SRC = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

function loadMermaid() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.mermaid) {
    return Promise.resolve();
  }

  if (window.__rjsMermaidLoader) {
    return window.__rjsMermaidLoader;
  }

  window.__rjsMermaidLoader = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${MERMAID_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Mermaid.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = MERMAID_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Mermaid."));
    document.head.appendChild(script);
  });

  return window.__rjsMermaidLoader;
}

async function renderMermaid() {
  const blocks = document.querySelectorAll(".mermaid");

  if (blocks.length === 0) {
    return;
  }

  await loadMermaid();

  if (!window.mermaid) {
    return;
  }

  blocks.forEach((block) => {
    block.removeAttribute("data-processed");
  });

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "neutral",
    fontFamily: "inherit",
  });

  await window.mermaid.run({
    querySelector: ".mermaid",
  });
}

export default function MermaidInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    void renderMermaid().catch(() => undefined);
  }, [pathname]);

  return null;
}
