#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: scripts/prepare-cover-image.sh <source-image> [output-name]"
  exit 1
fi

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick is required. Install it first: https://imagemagick.org"
  exit 1
fi

SOURCE_IMAGE="$1"

if [[ ! -f "$SOURCE_IMAGE" ]]; then
  echo "Source image not found: $SOURCE_IMAGE"
  exit 1
fi

slugify() {
  printf "%s" "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

SOURCE_BASENAME="$(basename "$SOURCE_IMAGE")"
SOURCE_NAME="${SOURCE_BASENAME%.*}"
OUTPUT_NAME="${2:-$SOURCE_NAME}"
OUTPUT_SLUG="$(slugify "$OUTPUT_NAME")"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/public/images/covers"
OUTPUT_FILE="$OUTPUT_DIR/$OUTPUT_SLUG.webp"
TMP_DIR="$(mktemp -d)"
PREPARED_IMAGE="$TMP_DIR/cover.png"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

mkdir -p "$OUTPUT_DIR"

magick "$SOURCE_IMAGE" \
  -resize 1200x630^ \
  -gravity center \
  -extent 1200x630 \
  -strip \
  "$PREPARED_IMAGE"

if command -v cwebp >/dev/null 2>&1; then
  cwebp -q 82 "$PREPARED_IMAGE" -o "$OUTPUT_FILE" >/dev/null
else
  magick "$PREPARED_IMAGE" -quality 82 "$OUTPUT_FILE"
fi

LQIP_BASE64="$(
  magick "$OUTPUT_FILE" -resize 20x20 -strip -quality 20 webp:- \
    | base64 \
    | tr -d '\n'
)"

cat <<EOF
Created:
  /images/covers/$OUTPUT_SLUG.webp

Frontmatter snippet:
image:
  path: /images/covers/$OUTPUT_SLUG.webp
  alt: "Describe the image"
  width: 1200
  height: 630
  lqip: data:image/webp;base64,$LQIP_BASE64
EOF
