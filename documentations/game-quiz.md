# Game and Quiz Authoring Guide

This guide explains how Club Kozenet Pro turns article questions into interactive Game training.

The goal is simple:

1. A contributor writes a normal article.
2. The article includes `quiz` blocks.
3. The Game page automatically creates a training set from those questions.
4. Search can find the training by article title, tags, categories, and quiz keywords.

No backend, database, or login is required for this current version.

## Current User Flow

The learner can:

1. Open the Game page.
2. Choose a training set.
3. Answer questions before the timer ends.
4. See feedback after each answer.
5. See the final result.
6. Try again or review the original article.

Scores are saved only in the learner's browser with `localStorage`.

## Where Questions Live

Questions live inside posts:

```text
src/_posts/en/
src/_posts/pt/
src/_posts/[language-code]/
```

Use a fenced code block named `quiz`:

````md
```quiz
{
  "id": "binary-symbols",
  "question": "Which symbols does binary use?",
  "image": "/images/boards/tabela-bases-numericas.svg",
  "options": ["0 and 1", "0 to 7", "0 to 9", "A to F"],
  "answer": 0,
  "explanation": "Binary is base 2, so it uses only two symbols: 0 and 1.",
  "tags": ["binary", "number systems", "beginner"],
  "timeLimit": 25
}
```
````

Inside the article, the block renders as a small training card. On the Game page, it becomes a playable question.

## Quiz Fields

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Recommended | string | Keep it unique inside the post. The final internal id also includes the post slug. |
| `question` | Yes | string | The question shown to the learner. |
| `options` | Yes | string array | At least two options are required. |
| `answer` | Yes | number or string | Recommended: zero-based option index. `0` means first option. |
| `explanation` | No | string | Shown after the learner answers. |
| `image` | No | string | Public image path, usually from `/images/boards/`. |
| `tags` | No | string array | Used for the training set and search. |
| `timeLimit` | No | number | Seconds for this question. Default is `30`. Minimum valid value is `5`. |

## Answer Rules

The recommended answer format is a zero-based number:

```json
"answer": 2
```

That means the correct answer is the third option.

The parser also accepts an exact option string, but numeric indexes are easier to review in pull requests.

## Good Question Style

Good training questions are short and focused:

- Ask one thing at a time.
- Use clear options.
- Avoid trick wording unless the lesson is about detecting that exact mistake.
- Add an explanation that teaches, not only says "correct".
- Use the same vocabulary as the article.

Better:

```json
"question": "What method converts decimal to another base?",
"options": [
  "Multiply by positional weights",
  "Use repeated division and read remainders from bottom to top",
  "Add all digits",
  "Replace each number with a letter"
]
```

Weaker:

```json
"question": "Which statement is not incorrect about non-decimal transformation?"
```

## Using Images

If a question depends on a visual explanation, point the `image` field to a public asset:

```json
"image": "/images/boards/binario-para-decimal-step-4.svg"
```

Recommended folders:

```text
public/images/boards/
public/images/math/
public/images/covers/
```

Use meaningful `BoardFigure` alt text in the article. The Game image currently uses the question text as its image alt text.

## Timers

Each question can define its own timer:

```json
"timeLimit": 35
```

If omitted, the default is `30` seconds.

On the Game page, the learner can also switch to a fixed timer. That setting overrides each question's `timeLimit` during that session only.

## How Training Sets Are Created

One post with one or more valid `quiz` blocks becomes one training set.

The training set uses:

- post title as the training title
- post description as the training description
- post categories for the training card
- post tags plus quiz tags for filtering and search
- post URL for the "Review article" link

This means contributors should avoid duplicating quiz data in another file. Put the questions in the article and let the app reuse them.

## Search Behavior

Search includes both articles and training sets.

Training results appear with a `Training` or `Treino` chip and use the article title, not a generic "Club360 Game" title.

The search link points directly to:

```text
/game?set=training-id
/pt/game?set=training-id
```

The search UI starts after 2 characters to avoid noisy one-letter results.

## Layout Behavior

The Game page has two layout modes:

- Hub mode: normal site layout with the right panel.
- Play mode: expanded training layout without the right panel.

This keeps discovery consistent with the rest of the site, while keeping the actual exercise screen focused.

## Interface Translations

Article content belongs in:

```text
src/_posts/[lang]/
```

Interface labels belong in:

```text
src/i18n/dictionaries/en.ts
src/i18n/dictionaries/pt.ts
```

When adding Game UI labels, do not hardcode text inside the component unless it is temporary. Add the label to each dictionary so future contributors can translate it.

## Maintainer Files

The current Game and quiz flow is implemented mainly in:

```text
src/lib/quiz-blocks.ts
src/lib/quizzes.ts
src/lib/search-documents.ts
src/components/pages/GamePage.tsx
src/components/pages/GameView.tsx
src/components/search/SearchResultsClient.tsx
```

Use these files when changing parsing, training creation, search indexing, or the interactive Game UI.

## Common Mistakes

- Missing commas in the JSON block.
- Using `answer: 1` when the first option is correct. The first option is `0`.
- Adding fewer than two options.
- Forgetting that image paths must start from `public`, for example `/images/boards/example.svg`.
- Adding quiz UI labels in only one language.
- Creating a separate question list instead of reusing article `quiz` blocks.

## Pull Request Checklist For Quiz Content

Before opening a pull request:

```bash
npm run check
```

For larger Game, search, or layout changes, also run:

```bash
npm run build
```

In the pull request description, mention:

- which article received quiz blocks
- how many questions were added
- whether the questions use images
- whether any UI text changed

