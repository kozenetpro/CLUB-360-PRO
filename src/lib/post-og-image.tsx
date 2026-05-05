import { ImageResponse } from "next/og";
import type { PostMeta } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";

export const POST_OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const POST_OG_IMAGE_ALT = "Article preview card";
export const POST_OG_IMAGE_CONTENT_TYPE = "image/png";

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function renderPostOgImage(post: PostMeta) {
  const category = post.categories[0] ?? "Post";
  const description = truncateText(post.description, 190);
  const title = truncateText(post.title, 95);
  const tags = post.tags.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at top right, rgba(59, 130, 246, 0.28), transparent 34%), radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.18), transparent 32%), #0f172a",
          color: "#f8fafc",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            borderRadius: "28px",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.76))",
            padding: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "9999px",
                  background: "#60a5fa",
                }}
              />
              <div style={{ fontSize: 24, color: "#cbd5e1" }}>{siteConfig.name}</div>
            </div>
            <div
              style={{
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "1px solid rgba(96, 165, 250, 0.45)",
                background: "rgba(37, 99, 235, 0.14)",
                color: "#bfdbfe",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "88%",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 26,
                fontSize: 28,
                lineHeight: 1.45,
                color: "#cbd5e1",
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {tags.length > 0
                ? tags.map((tag) => (
                    <div
                      key={tag}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(148, 163, 184, 0.25)",
                        background: "rgba(15, 23, 42, 0.5)",
                        color: "#cbd5e1",
                        fontSize: 22,
                      }}
                    >
                      {`#${tag}`}
                    </div>
                  ))
                : (
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 22,
                      }}
                    >
                      {`Shared from ${siteConfig.title}`}
                    </div>
                  )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "18px",
                color: "#94a3b8",
                fontSize: 22,
              }}
            >
              <div>{formatDate(post.date, "short")}</div>
              <div>{post.readingTime}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    POST_OG_IMAGE_SIZE
  );
}
