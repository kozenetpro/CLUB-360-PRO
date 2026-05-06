export interface ParsedQuizBlock {
  id?: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
  image?: string;
  tags: string[];
  timeLimit: number;
}

interface RawQuizBlock {
  id?: unknown;
  question?: unknown;
  options?: unknown;
  answer?: unknown;
  explanation?: unknown;
  image?: unknown;
  tags?: unknown;
  timeLimit?: unknown;
}

const DEFAULT_TIME_LIMIT = 30;

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => (typeof item === "string" ? [item] : []));
}

function resolveAnswerIndex(answer: unknown, options: string[]) {
  if (typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer < options.length) {
    return answer;
  }

  if (typeof answer === "string") {
    const normalizedAnswer = answer.trim().toLowerCase();
    const exactIndex = options.findIndex((option) => option.trim().toLowerCase() === normalizedAnswer);

    if (exactIndex >= 0) {
      return exactIndex;
    }

    const numericIndex = Number.parseInt(answer, 10);
    if (Number.isInteger(numericIndex) && numericIndex >= 0 && numericIndex < options.length) {
      return numericIndex;
    }
  }

  return -1;
}

export function parseQuizBlock(source: string): ParsedQuizBlock | null {
  let raw: RawQuizBlock;

  try {
    raw = JSON.parse(source) as RawQuizBlock;
  } catch {
    return null;
  }

  const question = typeof raw.question === "string" ? raw.question.trim() : "";
  const options = toStringArray(raw.options).map((option) => option.trim()).filter(Boolean);
  const answerIndex = resolveAnswerIndex(raw.answer, options);

  if (!question || options.length < 2 || answerIndex < 0) {
    return null;
  }

  const parsedTimeLimit = Number(raw.timeLimit);
  const timeLimit = Number.isFinite(parsedTimeLimit) && parsedTimeLimit >= 5 ? Math.round(parsedTimeLimit) : DEFAULT_TIME_LIMIT;

  return {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : undefined,
    question,
    options,
    answerIndex,
    explanation: typeof raw.explanation === "string" && raw.explanation.trim() ? raw.explanation.trim() : undefined,
    image: typeof raw.image === "string" && raw.image.trim() ? raw.image.trim() : undefined,
    tags: toStringArray(raw.tags).map((tag) => tag.trim()).filter(Boolean),
    timeLimit,
  };
}

export function extractQuizBlocks(source: string) {
  const blocks: ParsedQuizBlock[] = [];
  const quizBlockRegex = /```quiz\s*\r?\n([\s\S]*?)```/g;
  const content = source.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  let match;

  while ((match = quizBlockRegex.exec(content)) !== null) {
    const quiz = parseQuizBlock(match[1].trim());
    if (quiz) {
      blocks.push(quiz);
    }
  }

  return blocks;
}
