"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

interface ArticleShareProps {
  title: string;
  url: string;
}

export default function ArticleShare({ title, url }: ArticleShareProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setFeedback("Link copied");
    window.setTimeout(() => setFeedback(null), 2200);
  }

  async function shareArticle() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
        return;
      } catch {
        return;
      }
    }

    await copyLink();
  }

  return (
    <div className="post-share">
      <span className="post-share-label">Share this article</span>
      <div className="post-share-actions">
        <button type="button" className="post-share-button" onClick={shareArticle}>
          <Share2 size={15} />
          Share
        </button>
        <button type="button" className="post-share-button" onClick={copyLink}>
          {feedback ? <Check size={15} /> : <Copy size={15} />}
          {feedback ?? "Copy link"}
        </button>
      </div>
    </div>
  );
}
