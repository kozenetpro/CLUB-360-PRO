import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer
      className="py-6 mt-auto text-center text-xs"
      style={{ color: "var(--footer-text)" }}
    >
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <span>© {new Date().getFullYear()}</span>
        <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
          {siteConfig.name}
        </span>
      </div>
    </footer>
  );
}
