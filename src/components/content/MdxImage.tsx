import MediaLightbox from "@/components/content/MediaLightbox";
import { isSafeMediaUrl } from "@/lib/safe-url";

interface MdxImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

export default function MdxImage({ src, alt = "", title }: MdxImageProps) {
  if (!src || !isSafeMediaUrl(src)) {
    return null;
  }

  return (
    <span className="mdx-figure">
      <MediaLightbox
        src={src}
        alt={alt || title || "Article image"}
        className="mdx-figure-frame"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="mdx-figure-image" />
      </MediaLightbox>
      {title ? <span className="mdx-figure-caption">{title}</span> : null}
    </span>
  );
}
