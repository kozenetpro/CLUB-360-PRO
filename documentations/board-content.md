# Board Content Guide for Club 360 Pro

This guide is for lesson-style content:

- math notes
- club sessions
- logic explanations
- beginner coaching
- whiteboard or handwritten explanations
- Canva teaching illustrations

The goal is to make your posts easier to understand for someone seeing the concept for the first time.

## What You Can Use Now

You now have three content options inside posts:

1. Regular markdown images
2. `BoardFigure` for one strong teaching visual
3. `BoardSteps` for a sequence of board images

These work in your post files compiled through the MDX pipeline.

That means you can use them in your current post files even if the file extension is `.md`, not only `.mdx`.

## 1. Regular Markdown Image

If you just want to drop in an image:

```md
![Truth table drawn during the session](/images/boards/truth-table-session-1.webp)
```

That now renders in a cleaner article-friendly frame and opens as a full-size image when clicked.

## 2. `BoardFigure`

Use this when one image is the main explanation.

```mdx
<BoardFigure
  src="/images/boards/logic-variables.webp"
  alt="Whiteboard explanation of int, string, float, and boolean types"
  caption="Programming basics explained on the board"
  focus="Coaching board"
  note="I used this board to explain how variables and basic types work for a beginner before moving into small coding examples."
  width={1600}
  height={1000}
/>
```

Best use cases:

- one board from a club session
- one handwritten explanation
- one Canva learning visual
- one image you want people to study carefully

## 3. `BoardSteps`

Use this when understanding improves through progression.

```mdx
<BoardSteps
  title="How I explained logic step by step"
  summary="Instead of giving all the ideas at once, I broke the explanation into small visual steps."
>
  <BoardFigure
    src="/images/boards/logic-step-1.webp"
    alt="Board showing variables and basic types"
    caption="Step 1: Name the building blocks"
    focus="Step 1"
    width={1600}
    height={1000}
  />

  <BoardFigure
    src="/images/boards/logic-step-2.webp"
    alt="Board showing comparison and boolean results"
    caption="Step 2: Show what true and false mean"
    focus="Step 2"
    width={1600}
    height={1000}
  />
</BoardSteps>
```

Best use cases:

- teaching flow
- math reasoning in phases
- board snapshots from the same lesson
- explaining beginner mistakes and corrections

## Suggested Structure for Teaching Posts

This is a strong format for your site:

```md
## What we learned

Short summary in simple language.

## Board explanation

[Use BoardFigure here]

## Clean explanation

Rewrite the same idea clearly in text.

## Small example

Show a tiny code or math example.

## Key takeaway

End with one sentence the beginner should remember.
```

## Image Preparation

For board or Canva visuals:

- export to `.webp` when possible
- keep text readable
- crop empty space when it does not help
- use one image per idea, not one image for everything

You can reuse the existing helper script from [fast-image.md](fast-image.md) when the image should also be optimized like a normal site asset.

## Recommended Folder Structure

You can keep teaching visuals like this:

```text
public/images/boards/
public/images/math/
public/images/club/
```

Examples:

- `/images/boards/logic-variables.webp`
- `/images/math/limits-session-1.webp`
- `/images/club/python-basics-step-2.webp`

## Practical Advice

- Use handwritten boards for intuition.
- Use Canva visuals for clarity.
- Use text below the image so nobody is forced to understand from the image alone.
- Keep each board focused on one idea.
- When the image is dense, split it into steps.

## Most Important Idea

Your board content should not feel like decoration.

It should help the reader understand something faster than text alone.
