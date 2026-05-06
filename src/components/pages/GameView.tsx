"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Columns2,
  Copy,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Minus,
  PanelTop,
  Play,
  Plus,
  RotateCcw,
  Share2,
  Timer,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { localizePath, type Locale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import type { QuizItem, TrainingSet } from "@/lib/quizzes";
import { slugify } from "@/lib/utils";

interface GameViewProps {
  locale: Locale;
  trainingSets: TrainingSet[];
  initialSetId?: string;
}

interface AnswerRecord {
  quizId: string;
  selectedIndex: number;
  correct: boolean;
}

type LayoutMode = "split" | "media-first" | "question-first";
type TimerMode = "question" | "fixed";

const TIMER_MIN = 5;
const TIMER_MAX = 300;
const TIMER_STEP = 5;
const ZOOM_MIN = 80;
const ZOOM_MAX = 140;
const ZOOM_STEP = 10;

function getBestKey(setId: string) {
  return `club360-game-best-${setId}`;
}

function clampTimer(value: number) {
  if (!Number.isFinite(value)) {
    return 30;
  }

  return Math.min(TIMER_MAX, Math.max(TIMER_MIN, Math.round(value)));
}

function resolveDuration(question: QuizItem | null, timerMode: TimerMode, fixedTimer: number) {
  if (!question) {
    return 0;
  }

  return timerMode === "fixed" ? fixedTimer : question.timeLimit;
}

export default function GameView({ locale, trainingSets, initialSetId }: GameViewProps) {
  const dictionary = getDictionary(locale);
  const stageRef = useRef<HTMLDivElement>(null);
  const initialSet = initialSetId ? trainingSets.find((set) => set.id === initialSetId) ?? null : null;
  const [selectedSetId, setSelectedSetId] = useState<string | null>(() => initialSet?.id ?? null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    resolveDuration(initialSet?.questions[0] ?? null, "question", 30)
  );
  const [timerMode, setTimerMode] = useState<TimerMode>("question");
  const [fixedTimer, setFixedTimer] = useState(30);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("split");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [focusMode, setFocusMode] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [bestScores, setBestScores] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const storedScores: Record<string, number> = {};

    trainingSets.forEach((set) => {
      const score = Number(window.localStorage.getItem(getBestKey(set.id)));
      if (Number.isFinite(score)) {
        storedScores[set.id] = score;
      }
    });

    return storedScores;
  });

  const selectedSet = useMemo(
    () => trainingSets.find((set) => set.id === selectedSetId) ?? null,
    [selectedSetId, trainingSets]
  );
  const currentQuestion = selectedSet?.questions[questionIndex] ?? null;
  const locked = selectedOption !== null;
  const isFinished = Boolean(selectedSet && questionIndex >= selectedSet.questions.length);
  const correctCount = answers.filter((answer) => answer.correct).length;
  const activeDuration = resolveDuration(currentQuestion, timerMode, fixedTimer);

  useEffect(() => {
    document.body.dataset.gameMode = selectedSet ? "play" : "hub";

    return () => {
      delete document.body.dataset.gameMode;
    };
  }, [selectedSet]);

  useEffect(() => {
    const syncFullscreen = () => {
      setFocusMode(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", syncFullscreen);

    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (!currentQuestion || locked || isFinished) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setSelectedOption(-1);
          setAnswers((previous) => [
            ...previous,
            {
              quizId: currentQuestion.id,
              selectedIndex: -1,
              correct: false,
            },
          ]);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentQuestion, isFinished, locked]);

  const updateBestScore = (set: TrainingSet, completedAnswers: AnswerRecord[]) => {
    const score = completedAnswers.filter((answer) => answer.correct).length;
    const previousBest = bestScores[set.id] ?? 0;

    if (score > previousBest) {
      window.localStorage.setItem(getBestKey(set.id), String(score));
      setBestScores((previous) => ({ ...previous, [set.id]: score }));
    }
  };

  const setQuestionTimer = (question: QuizItem | null, nextTimerMode = timerMode, nextFixedTimer = fixedTimer) => {
    setSecondsLeft(resolveDuration(question, nextTimerMode, nextFixedTimer));
  };

  const getTrainingHref = (setId: string) =>
    localizePath(`/game?set=${encodeURIComponent(setId)}`, locale);

  const startTraining = (setId: string) => {
    const nextSet = trainingSets.find((set) => set.id === setId);

    setSelectedSetId(setId);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShareStatus("");
    setQuestionTimer(nextSet?.questions[0] ?? null);

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", getTrainingHref(setId));
    }
  };

  const resetTraining = () => {
    if (!selectedSet) {
      return;
    }

    startTraining(selectedSet.id);
  };

  const chooseAnotherTraining = () => {
    setSelectedSetId(null);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShareStatus("");

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", localizePath("/game", locale));
    }
  };

  const submitAnswer = (optionIndex: number) => {
    if (!currentQuestion || locked) {
      return;
    }

    setSelectedOption(optionIndex);
    setAnswers((previous) => [
      ...previous,
      {
        quizId: currentQuestion.id,
        selectedIndex: optionIndex,
        correct: optionIndex === currentQuestion.answerIndex,
      },
    ]);
  };

  const nextQuestion = () => {
    if (!selectedSet) {
      return;
    }

    if (questionIndex + 1 === selectedSet.questions.length) {
      updateBestScore(selectedSet, answers);
    } else {
      setQuestionTimer(selectedSet.questions[questionIndex + 1] ?? null);
    }

    setQuestionIndex((current) => current + 1);
    setSelectedOption(null);
  };

  const updateTimerMode = (nextMode: TimerMode) => {
    setTimerMode(nextMode);
    if (currentQuestion && !locked && !isFinished) {
      setQuestionTimer(currentQuestion, nextMode, fixedTimer);
    }
  };

  const updateFixedTimer = (value: number) => {
    const nextFixedTimer = clampTimer(value);
    setFixedTimer(nextFixedTimer);
    if (timerMode === "fixed" && currentQuestion && !locked && !isFinished) {
      setQuestionTimer(currentQuestion, "fixed", nextFixedTimer);
    }
  };

  const changeZoom = (direction: 1 | -1) => {
    setZoomLevel((current) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, current + direction * ZOOM_STEP)));
  };

  const toggleFocusMode = async () => {
    if (focusMode) {
      setFocusMode(false);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => undefined);
      }
      return;
    }

    setFocusMode(true);
    await stageRef.current?.requestFullscreen?.().catch(() => undefined);
  };

  const shareTraining = async () => {
    const path = selectedSet ? getTrainingHref(selectedSet.id) : localizePath("/game", locale);
    const url = typeof window === "undefined" ? "" : new URL(path, window.location.origin).toString();
    const title = selectedSet?.title ?? dictionary.game.title;

    if (navigator.share) {
      await navigator.share({ title, text: dictionary.game.shareText, url }).catch(() => undefined);
      return;
    }

    await navigator.clipboard?.writeText(url).catch(() => undefined);
    setShareStatus(dictionary.game.copied);
  };

  const renderTimerControl = () => (
    <div className="game-timer-widget" aria-label={dictionary.game.timerSettings}>
      <label>
        <span>{dictionary.game.timer}</span>
        <select value={timerMode} onChange={(event) => updateTimerMode(event.target.value as TimerMode)}>
          <option value="question">{dictionary.game.timerQuestion}</option>
          <option value="fixed">{dictionary.game.timerFixed}</option>
        </select>
      </label>
      <label>
        <span>{dictionary.game.seconds}</span>
        <input
          type="number"
          min={TIMER_MIN}
          max={TIMER_MAX}
          step={TIMER_STEP}
          value={fixedTimer}
          disabled={timerMode !== "fixed"}
          onChange={(event) => updateFixedTimer(Number(event.target.value))}
        />
      </label>
    </div>
  );

  const renderToolbar = () => (
    <div className="game-stage-toolbar">
      <div className="game-toolbar-left">
        <button type="button" className="game-secondary-button" onClick={chooseAnotherTraining}>
          <ArrowLeft size={16} />
          {dictionary.game.back}
        </button>
        <span className="game-timer-pill">
          <Timer size={16} />
          {secondsLeft}{dictionary.game.secondsShort}
        </span>
      </div>

      <div className="game-toolbar-right">
        {renderTimerControl()}
        <div className="game-segmented" aria-label={dictionary.game.layout}>
          <button
            type="button"
            aria-label={dictionary.game.layoutSplit}
            title={dictionary.game.layoutSplit}
            data-active={layoutMode === "split" || undefined}
            onClick={() => setLayoutMode("split")}
          >
            <Columns2 size={16} />
          </button>
          <button
            type="button"
            aria-label={dictionary.game.layoutMediaFirst}
            title={dictionary.game.layoutMediaFirst}
            data-active={layoutMode === "media-first" || undefined}
            onClick={() => setLayoutMode("media-first")}
          >
            <ImageIcon size={16} />
          </button>
          <button
            type="button"
            aria-label={dictionary.game.layoutQuestionFirst}
            title={dictionary.game.layoutQuestionFirst}
            data-active={layoutMode === "question-first" || undefined}
            onClick={() => setLayoutMode("question-first")}
          >
            <PanelTop size={16} />
          </button>
        </div>
        <div className="game-segmented" aria-label={dictionary.game.zoom}>
          <button type="button" aria-label={dictionary.game.zoomOut} title={dictionary.game.zoomOut} onClick={() => changeZoom(-1)}>
            <Minus size={16} />
          </button>
          <span>{zoomLevel}%</span>
          <button type="button" aria-label={dictionary.game.zoomIn} title={dictionary.game.zoomIn} onClick={() => changeZoom(1)}>
            <Plus size={16} />
          </button>
        </div>
        <button type="button" className="game-icon-button" aria-label={dictionary.game.share} title={dictionary.game.share} onClick={shareTraining}>
          {shareStatus ? <Copy size={16} /> : <Share2 size={16} />}
        </button>
        <ThemeToggle />
        <button
          type="button"
          className="game-icon-button"
          aria-label={focusMode ? dictionary.game.exitFocus : dictionary.game.focus}
          title={focusMode ? dictionary.game.exitFocus : dictionary.game.focus}
          onClick={toggleFocusMode}
        >
          {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );

  if (trainingSets.length === 0) {
    return (
      <section className="game-empty-card">
        <p className="game-kicker">{dictionary.game.kicker}</p>
        <h1>{dictionary.game.emptyTitle}</h1>
        <p>{dictionary.game.emptyDescription}</p>
      </section>
    );
  }

  if (!selectedSet) {
    return (
      <div className="game-hub">
        <section className="game-hero-panel">
          <div>
            <p className="game-kicker">{dictionary.game.kicker}</p>
            <h1>{dictionary.game.title}</h1>
            <p>{dictionary.game.description}</p>
          </div>
          <div className="game-hero-controls">
            {renderTimerControl()}
            <button type="button" className="game-secondary-button" onClick={shareTraining}>
              <Share2 size={16} />
              {dictionary.game.share}
            </button>
          </div>
        </section>

        <div className="game-training-grid">
          {trainingSets.map((set) => {
            const best = bestScores[set.id] ?? 0;

            return (
              <article key={set.id} className="game-training-card">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {set.categories.slice(0, 3).map((category) => (
                      <Link
                        key={category}
                        href={localizePath(`/categories/${slugify(category)}`, locale)}
                        className="game-chip game-chip-link"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                  <h2>{set.title}</h2>
                  <p>{set.description}</p>
                  <div className="game-training-meta">
                    <span>
                      <BookOpen size={14} /> {set.questions.length} {dictionary.game.questions}
                    </span>
                    <span>
                      <Trophy size={14} /> {dictionary.game.best}: {best}/{set.questions.length}
                    </span>
                  </div>
                  {set.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {set.tags.slice(0, 8).map((tag) => (
                        <Link key={tag} href={localizePath(`/tags/${slugify(tag)}`, locale)} className="game-chip game-chip-link">
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button type="button" className="game-primary-button" onClick={() => startTraining(set.id)}>
                  <Play size={16} />
                  {dictionary.game.start}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((correctCount / selectedSet.questions.length) * 100);

    return (
      <section className="game-result-card">
        <p className="game-kicker">{dictionary.game.result}</p>
        <h1>
          {correctCount}/{selectedSet.questions.length} · {accuracy}%
        </h1>
        <p>{dictionary.game.resultDescription}</p>

        <div className="game-result-actions">
          <button type="button" className="game-primary-button" onClick={resetTraining}>
            <RotateCcw size={16} />
            {dictionary.game.tryAgain}
          </button>
          <button type="button" className="game-secondary-button" onClick={chooseAnotherTraining}>
            <ArrowLeft size={16} />
            {dictionary.game.chooseAnother}
          </button>
          <Link href={selectedSet.postHref} className="game-secondary-button">
            <BookOpen size={16} />
            {dictionary.game.reviewArticle}
          </Link>
        </div>
      </section>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const stageStyle = { "--game-zoom": zoomLevel / 100 } as CSSProperties;

  return (
    <div
      ref={stageRef}
      className="game-stage"
      data-focus={focusMode || undefined}
      data-layout={layoutMode}
      style={stageStyle}
    >
      {renderToolbar()}

      <section className="game-play-surface">
        {currentQuestion.image ? (
          <div className="game-media-panel">
            <Image
              src={currentQuestion.image}
              alt={currentQuestion.question}
              width={1200}
              height={720}
              className="game-question-image"
              priority
            />
          </div>
        ) : null}

        <div className="game-question-panel">
          <div className="game-question-meta">
            <span className="game-chip">
              {dictionary.game.question} {questionIndex + 1}/{selectedSet.questions.length}
            </span>
            <Link href={selectedSet.postHref} className="game-chip game-chip-link">
              {selectedSet.postTitle}
            </Link>
          </div>

          <h1>{currentQuestion.question}</h1>

          <div className="game-options-grid">
            {currentQuestion.options.map((option, index) => {
              const correct = index === currentQuestion.answerIndex;
              const selected = selectedOption === index;
              const revealCorrect = locked && correct;
              const revealWrong = locked && selected && !correct;

              return (
                <button
                  key={option}
                  type="button"
                  disabled={locked}
                  className="game-option-button"
                  data-correct={revealCorrect || undefined}
                  data-wrong={revealWrong || undefined}
                  onClick={() => submitAnswer(index)}
                >
                  <span>{option}</span>
                  {revealCorrect ? <CheckCircle2 size={18} /> : null}
                  {revealWrong ? <XCircle size={18} /> : null}
                </button>
              );
            })}
          </div>

          {locked ? (
            <div className="game-feedback-panel">
              <p>{selectedOption === currentQuestion.answerIndex ? dictionary.game.correct : dictionary.game.incorrect}</p>
              {currentQuestion.explanation ? <span>{currentQuestion.explanation}</span> : null}
              <button type="button" className="game-primary-button" onClick={nextQuestion}>
                {questionIndex + 1 === selectedSet.questions.length ? dictionary.game.finish : dictionary.game.next}
              </button>
            </div>
          ) : (
            <div className="game-helper-panel">
              <Timer size={16} />
              <span>
                {dictionary.game.activeTimer}: {activeDuration}{dictionary.game.secondsShort}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
