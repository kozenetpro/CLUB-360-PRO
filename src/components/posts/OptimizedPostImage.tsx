import Image from "next/image";

interface OptimizedPostImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lqip?: string;
  sizes: string;
  priority?: boolean;
  wrapperClassName?: string;
  imageClassName?: string;
}

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;

export default function OptimizedPostImage({
  src,
  alt,
  width,
  height,
  lqip,
  sizes,
  priority = false,
  wrapperClassName = "",
  imageClassName = "",
}: OptimizedPostImageProps) {
  const resolvedWidth = width ?? DEFAULT_WIDTH;
  const resolvedHeight = height ?? DEFAULT_HEIGHT;
  const placeholder = lqip ? "blur" : "empty";

  return (
    <div
      className={`relative w-full overflow-hidden ${wrapperClassName}`.trim()}
      style={{ aspectRatio: `${resolvedWidth} / ${resolvedHeight}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={lqip}
        className={imageClassName}
      />
    </div>
  );
}
