# Multi-Language Blog Architecture

## Folder Structure

```
src/
├── _posts/
│   ├── en/
│   │   └── 2023-07-17-roadmap-resources-student-developer.md
│   ├── pt/
│   │   └── 2023-07-17-roadmap-recursos-desenvolvedor-iniciante.md
│
├── app/
│   ├── [lang]/
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx
│
├── i18n/
│   ├── locales.ts
│   ├── dictionaries.ts
│   └── dictionaries/
│       ├── en.ts
│       └── pt.ts
```

## How It Works

### Interface Translations

The site interface is translated through dictionaries:

```text
src/i18n/locales.ts
src/i18n/dictionaries.ts
src/i18n/dictionaries/
```

Use these dictionaries for navigation, page titles, About text, search text, sidebar labels, and empty states. Do not hardcode user-facing UI text inside page components when the text should be translated.

### Post Storage
- **English posts**: `src/_posts/en/*.md`
- **Portuguese posts**: `src/_posts/pt/*.md`
- **Future languages**: Add new folders like `src/_posts/es/`, `src/_posts/fr/` etc.

### Post Naming
Posts use the date-based naming convention:
- Format: `YYYY-MM-DD-post-title.md`
- Example: `2023-07-17-roadmap-resources-student-developer.md`

### URL Generation
English is the default language and uses clean URLs. Other languages use language-prefixed URLs:

- English: `/posts/roadmap-resources-student-developer`
- Portuguese: `/pt/posts/roadmap-recursos-desenvolvedor-iniciante`

### Frontmatter
Each post should have this structure:
```yaml
---
title: "Post Title"
description: "Short description for SEO and previews"
date: 2023-07-17
categories: ["Category1", "Category2"]
tags: ["tag1", "tag2"]
---
```

### Slug Format
The library automatically generates slugs in the format: `lang/post-name`
- From file: `en/2023-07-17-roadmap-resources-student-developer.md`
- Slug: `en/roadmap-resources-student-developer`
- URL: `/posts/roadmap-resources-student-developer`

## Adding New Posts

### For English:
Create file: `src/_posts/en/2024-05-01-my-new-post.md`

### For Portuguese:
Create file: `src/_posts/pt/2024-05-01-meu-novo-post.md`

## Adding New Languages

1. Create new folder: `src/_posts/[lang-code]/`
2. Create posts in that folder
3. Posts will automatically be discovered by the site
4. Posts will be accessible at `http://localhost:3000/[lang-code]/posts/[slug]`

## Benefits

- **Clean Organization**: Posts grouped by language
- **Scalable**: Easy to add new languages
- **Language-Aware URLs**: Clear URL structure
- **Language in Metadata**: `lang` field available in PostMeta
- **Future i18n Ready**: Foundation for full internationalization
