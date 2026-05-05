import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/content/mdx-components";

function normalizeText(source: string) {
  return source.trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeHtml(source: string) {
  return source
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripLeadingTitleHeading(source: string, title?: string) {
  if (!title) {
    return source;
  }

  const match = source.match(/^\s*#\s+(.+?)\s*(?:\r?\n){1,2}/);

  if (!match) {
    return source;
  }

  if (normalizeText(match[1]) !== normalizeText(title)) {
    return source;
  }

  return source.slice(match[0].length);
}

function normalizePromptBlocks(source: string) {
  return source.replace(
    /((?:^>.*(?:\r?\n|$))+)\s*\{\:\s*\.prompt-(tip|info|warning|danger)\s*\}\s*$/gm,
    (_, quotedBlock: string, promptType: string) => {
      const content = quotedBlock
        .trim()
        .split(/\r?\n/)
        .map((line: string) => line.replace(/^>\s?/, ""))
        .join("\n");

      return `<blockquote className="prompt prompt-${promptType}">\n${content}\n</blockquote>\n`;
    }
  );
}

function normalizeMermaidBlocks(source: string) {
  return source.replace(/```mermaid\s*\r?\n([\s\S]*?)```/g, (_, mermaidCode: string) => {
    const diagram = escapeHtml(mermaidCode.trim());
    return `<pre className="mermaid">${diagram}</pre>\n`;
  });
}

function normalizeYoutubeEmbeds(source: string) {
  return source.replace(
    /\{%\s*include\s+embed\/youtube\.html\s+id=['"]([^'"]+)['"]\s*%\}/g,
    (_, id: string) => {
      if (!/^[a-zA-Z0-9_-]{6,}$/.test(id)) {
        return "";
      }

      return `<div className="video-embed"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video player" loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>`;
    }
  );
}

export function normalizeChirpyContent(source: string) {
  return normalizeMermaidBlocks(
    normalizeYoutubeEmbeds(
      normalizePromptBlocks(source)
      .replace(/^\{\:\s*\.nolineno\s*\}\s*$/gm, "")
      .replace(/\)\{\:\s*target="_blank"[^}]*\}/g, ")")
      .replace(/\)\{\:\s*\.shadow\s+\.rounded-10\s*\}/g, ")")
      .replace(/^\s*\{\:\s*\.shadow\s+\.rounded-10\s*\}\s*$/gm, "")
      .replace(/<!--more-->/g, "")
    )
  );
}

export async function compileMdxContent(source: string, options?: { title?: string }) {
  const normalizedSource = normalizeChirpyContent(stripLeadingTitleHeading(source, options?.title));
  const { content } = await compileMDX({
    source: normalizedSource,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });
  return content;
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const normalizedContent = normalizeChirpyContent(content);
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(normalizedContent)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}
