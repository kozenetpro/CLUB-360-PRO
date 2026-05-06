# Contributing

Thank you for helping Club 360 Pro grow as an open learning project.

## What You Can Contribute

- New technical articles or lessons
- Translations
- Corrections to existing posts
- Better diagrams, screenshots, or examples
- UI and accessibility improvements
- Documentation improvements

## Contributor Guides

Start with the documentation index:

- [documentations/README.md](documentations/README.md)

For interactive practice questions, read:

- [documentations/game-quiz.md](documentations/game-quiz.md)

## Content Rules

- Write for learners. Prefer clear examples over vague advice.
- Do not include private keys, passwords, access tokens, or private student data.
- Use `collaborators` in frontmatter when a post has contributors.
- Add meaningful alt text for images.
- Cite sources when a post depends on external material.
- Put Game practice questions inside article `quiz` blocks so the article and Game reuse the same source content.

## Pull Request Checklist

Before opening a pull request:

```bash
npm run check
```

For larger UI or app changes, also run:

```bash
npm run build
```

Maintainers may request edits for clarity, security, formatting, or consistency with the project.
