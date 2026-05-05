import type { ReactNode } from "react";

interface BoardStepsProps {
  title?: string;
  summary?: string;
  children: ReactNode;
}

export default function BoardSteps({ title, summary, children }: BoardStepsProps) {
  return (
    <section className="board-steps">
      {(title || summary) ? (
        <header className="board-steps-header">
          {title ? <h3 className="board-steps-title">{title}</h3> : null}
          {summary ? <p className="board-steps-summary">{summary}</p> : null}
        </header>
      ) : null}
      <div className="board-steps-grid">{children}</div>
    </section>
  );
}
