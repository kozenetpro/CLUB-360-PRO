# Fast Image Guide for Club 360 Pro

This guide adapts the DigitalDenCloud LQIP + WebP workflow to your Next.js site.

The goal is simple:

- keep post cover images light
- show a blurred preview while the full image loads
- use the same image in the home card and the article page
- store the image metadata in frontmatter so the workflow stays easy

## What Is Already Wired In This Project

The project now supports this frontmatter shape for post covers:

```yaml
image:
  path: /images/covers/my-cover.webp
  alt: "Short description of the image"
  width: 1200
  height: 630
  lqip: data:image/webp;base64,...
```

That frontmatter is used in:

- homepage post cards
- article cover image on `/posts/...`
- article cover image on `/en/posts/...` and `/pt/posts/...`

## Recommended Cover Format

Use this format for post covers:

- size: `1200 x 630`
- ratio: `1.91:1`
- format: `.webp`

That matches the same shape used in the DigitalDenCloud guide and works well for blog cards, article covers, and social sharing images.

## Where To Put Images

Store post cover images here:

```text
public/images/covers/
```

In frontmatter, reference them like this:

```yaml
image:
  path: /images/covers/my-cover.webp
```

## Fastest Workflow

### 1. Prepare the source image

Start with a PNG, JPG, or another high-quality source image.

If needed, crop it visually first in Canva, Figma, Photoshop, or another editor so the composition looks right at `1200x630`.

### 2. Run the helper script

This repo now includes:

```text
scripts/prepare-cover-image.sh
```

It works with `ImageMagick` alone. If `cwebp` is installed, the script will use it automatically, but it is no longer required.

Run it like this:

```bash
./scripts/prepare-cover-image.sh ~/Downloads/my-image.png terraform-remote-backend
```

What it does:

- crops/resizes the source to `1200x630`
- strips extra metadata
- converts the file to `.webp`
- generates a tiny WebP LQIP
- prints a ready-to-paste frontmatter snippet

Output file:

```text
public/images/covers/terraform-remote-backend.webp
```

### 3. Paste the frontmatter snippet into your post

Example:

```yaml
---
title: "Setting Up a Terraform Remote Backend on AWS"
description: "A practical pattern for bootstrapping Terraform remote state on AWS."
date: 2026-04-27
categories: ["AWS", "Terraform"]
tags: ["terraform", "aws", "s3"]
image:
  path: /images/covers/terraform-remote-backend.webp
  alt: "Illustration representing Terraform remote backend on AWS"
  width: 1200
  height: 630
  lqip: data:image/webp;base64,UklGR...
---
```

Use that in files like:

- `src/_posts/en/my-post.md`
- `src/_posts/pt/meu-post.md`

## Manual Workflow If You Don’t Want The Script

### 1. Convert to WebP

If you have `cwebp`:

```bash
magick input.png -resize 1200x630^ -gravity center -extent 1200x630 -strip prepared.png
cwebp -q 82 prepared.png -o my-cover.webp
```

If you only have `ImageMagick`:

```bash
magick input.png -resize 1200x630^ -gravity center -extent 1200x630 -strip prepared.png
magick prepared.png -quality 82 my-cover.webp
```

### 2. Generate the LQIP

```bash
magick my-cover.webp -resize 20x20 -strip -quality 20 webp:- | base64 | tr -d '\n'
```

Then add the result as:

```yaml
lqip: data:image/webp;base64,PASTE_THE_OUTPUT_HERE
```

## Why This Is Needed In Next.js

`next/image` already helps with:

- responsive sizes
- lazy loading
- preventing layout shift
- serving optimized formats when possible

But in this project the post cover image comes from markdown frontmatter as a string path like `/images/covers/my-cover.webp`.

Because that is a dynamic string, Next.js does **not** auto-generate the blur placeholder for you. The official docs say that `blurDataURL` is automatic for static imports of `jpg`, `png`, `webp`, or `avif`, but for dynamic images you must provide it manually.

That is why this workflow keeps the Digital-style `lqip` field in frontmatter.

## Best Practices For This Site

- Use WebP for photo-style covers and thumbnails.
- Keep SVG for icons, diagrams, or illustrations that are naturally vector.
- Keep LQIP small. Tiny is better than detailed.
- Write a real `alt` description for every cover image.
- Reuse the same cover path in both English and Portuguese versions when the artwork is the same.

## Important Note About Inline Markdown Images

This guide currently covers **post cover images** used by frontmatter.

Regular markdown images inside the article body, such as:

```md
![Example](/images/posts/example.webp)
```

are still separate from this cover-image flow.

If you want, the next step can be adding a custom MDX image component so inline article images also use `next/image` with a more optimized workflow.

## References

- DigitalDenCloud guide: `https://docs.digitalden.cloud/posts/create-fast-loading-images-with-lqip-webp-in-your-jekyll-chirpy-site/`
- Next.js image docs: `https://nextjs.org/docs/app/api-reference/components/image`
- Next.js image optimization guide: `https://nextjs.org/docs/app/getting-started/images`
