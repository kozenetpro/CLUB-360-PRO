import Image from "next/image";
import MediaLightbox from "@/components/content/MediaLightbox";
import { isSafeMediaUrl } from "@/lib/safe-url";

interface BoardFigureProps {
  src: string;
  alt: string;
  caption?: string;
  note?: string;
  focus?: string;
  width?: number;
  height?: number;
  lqip?: string;
  priority?: boolean;
}

const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = 1000;

export default function BoardFigure({
  src,
  alt,
  caption,
  note,
  focus,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  lqip,
  priority = false,
}: BoardFigureProps) {
  if (!isSafeMediaUrl(src)) {
    return null;
  }

  return (
    <figure className="board-figure">
      {(focus || caption) ? (
        <div className="board-figure-header">
          {focus ? <span className="board-figure-focus">{focus}</span> : null}
          {caption ? <p className="board-figure-title">{caption}</p> : null}
        </div>
      ) : null}

      <MediaLightbox
        src={src}
        alt={alt}
        className="board-figure-frame"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1280px) 820px, (min-width: 768px) calc(100vw - 420px), 100vw"
          priority={priority}
          placeholder={lqip ? "blur" : "empty"}
          blurDataURL={lqip}
          className="board-figure-image"
        />
      </MediaLightbox>

      <figcaption className="board-figure-caption">
        <span>{alt}</span>
        <span className="board-figure-action">Open preview</span>
      </figcaption>

      {note ? <p className="board-figure-note">{note}</p> : null}
    </figure>
  );
}
