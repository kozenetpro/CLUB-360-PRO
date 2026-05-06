# Club 360 Pro

Open-source community blog for Club 360 Pro. Students and members can contribute lessons, translations, technical notes, diagrams, and project write-ups through GitHub pull requests.

Production domain target: `https://club360.kozenetpro.com`

## Tech Stack

- Next.js App Router
- TypeScript
- MDX and Markdown content
- GitHub Actions for linting, type checking, content validation, builds, dependency review, and CodeQL security analysis

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Use a local environment file when testing the production URL:

```bash
cp .env.example .env.local
```

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run validate:posts
npm run check
npm run build
```

## Writing Content

Posts live in language folders:

```text
src/_posts/en/
src/_posts/pt/
src/_posts/es/
src/_posts/fr/
```

Add any language by creating a folder with a valid language code. No code change is needed.

Basic post:

```md
---
title: "My Lesson"
description: "Short summary for previews and SEO."
date: 2026-05-04
categories: ["Programming"]
tags: ["javascript", "beginner"]
collaborators:
  - name: "Your Name"
    src: "https://avatars.githubusercontent.com/u/YOUR_ID"
---

# My Lesson

Write the lesson here.
```

For the full authoring guide, see [documentations/markdown-authoring.md](documentations/markdown-authoring.md).

Articles can also include `quiz` blocks. When a post has valid quiz blocks, the site automatically turns it into a Game training set so learners can practice from the same content. See [documentations/game-quiz.md](documentations/game-quiz.md).

Use the same optional `translationKey` across translated versions of the same article. This lets the language switcher move readers between matching posts instead of guessing by slug.

## Translating The Interface

Site UI translations live in:

```text
src/i18n/dictionaries/
src/i18n/locales.ts
```

Add or edit labels there for navigation, About, search, panels, empty states, and system pages. Keep article translations in `src/_posts/[lang]/`; keep interface translations in `src/i18n/`.

English uses clean URLs like `/about`. Other supported interface languages use a locale prefix like `/pt/about`.

More contributor guides are available in [documentations/](documentations/).

## Contribution Flow

1. Fork the repository.
2. Create a branch for your content or fix.
3. Add or edit files.
4. Run `npm run check`.
5. Open a pull request.

Every pull request runs automated checks. Maintainers should also enable branch protection on `master` and require the CI, CodeQL, and dependency review checks before merge.

## License

MIT
