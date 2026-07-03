"use client";

import * as React from "react";
import { X, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DoodleTarget, DoodleCheck } from "@/components/doodles";
import type { QuizQuestion, StudySection } from "@/lib/types";

/**
 * "Quiz this section" — a focused MCQ check for ONE section, shown as a
 * modal over the notebook. Uses the set's questions tagged with this
 * section's topic; when the section is thin on questions, it tops up with
 * scenario checks synthesized from the section's own text (key-term cloze),
 * so every section can be quizzed for conceptual understanding.
 */

type SectionQuestion = Pick<
  QuizQuestion,
  "prompt" | "choices" | "correctIndex" | "explanation"
> & { scenario?: boolean };

const STOP_WORDS = new Set(
  "the a an and or but with from into onto over under this that these those which where when while their there its his her our your they them then than also very more most some many much each such only both been being are is was were will would can could should may might must have has had does doing done not no nor within without between through during before after above below again further once here all any few other same so too".split(
    " ",
  ),
);

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>#~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Key terms = distinctive words the section actually teaches. */
function keyTerms(text: string): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.split(/[^A-Za-z0-9-]+/)) {
    const w = raw.trim();
    if (w.length < 5 || STOP_WORDS.has(w.toLowerCase())) continue;
    if (/^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([w]) => w);
}

/**
 * Synthesize scenario questions from the section text: pick informative
 * sentences, blank out a key term, and offer other key terms as distractors.
 * Deterministic (no randomness) so a section always gets the same checks.
 */
export function synthesizeScenarios(
  section: Pick<StudySection, "title" | "content">,
  count: number,
): SectionQuestion[] {
  const text = stripMarkdown(section.content || "");
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 50 && s.length <= 220);
  const terms = keyTerms(text);
  if (!sentences.length || terms.length < 4) return [];

  const out: SectionQuestion[] = [];
  const usedTerms = new Set<string>();

  for (const sentence of sentences) {
    if (out.length >= count) break;
    // The blanked term: the highest-ranked key term present in this sentence.
    const term = terms.find(
      (t) =>
        !usedTerms.has(t) &&
        new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(
          sentence,
        ),
    );
    if (!term) continue;
    usedTerms.add(term);

    const distractors = terms
      .filter((t) => t !== term && t.toLowerCase() !== term.toLowerCase())
      .slice(0, 8)
      .filter((t) => !sentence.includes(t))
      .slice(0, 3);
    if (distractors.length < 3) continue;

    const blanked = sentence.replace(
      new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`),
      "_____",
    );
    // Deterministic position for the correct answer.
    const pos = (term.length + sentence.length) % 4;
    const choices = [...distractors];
    choices.splice(pos, 0, term);

    out.push({
      prompt: `Scenario check — from “${section.title}”: ${blanked}`,
      choices,
      correctIndex: pos,
      explanation: `The passage reads: “${sentence}”`,
      scenario: true,
    });
  }
  return out;
}

export function SectionQuizModal({
  section,
  questions,
  onClose,
  onComplete,
}: {
  section: Pick<StudySection, "title" | "content">;
  /** The set's questions already filtered to this section's topic. */
  questions: QuizQuestion[];
  onClose: () => void;
  /** Fires when the run finishes; caller records progress + advances. */
  onComplete: (r: { correct: number; total: number }) => void;
}) {
  // Top up thin sections with synthesized scenario checks (target ≥3).
  const all = React.useMemo<SectionQuestion[]>(() => {
    const real: SectionQuestion[] = questions.map((q) => ({ ...q }));
    if (real.length >= 3) return real.slice(0, 6);
    const scenarios = synthesizeScenarios(section, 3 - real.length + 1);
    return [...real, ...scenarios].slice(0, 6);
  }, [questions, section]);

  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const q = all[i];

  // Lock page scroll while open + close on Escape.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function pick(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === q.correctIndex) setCorrect((c) => c + 1);
  }

  function next() {
    if (i + 1 >= all.length) {
      setDone(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  }

  if (!all.length) {
    return (
      <Overlay onClose={onClose}>
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            This section is too short to quiz yet — read it and mark it done,
            or add more material to the set.
          </p>
          <Button className="mt-4" onClick={onClose}>
            Back to reading
          </Button>
        </div>
      </Overlay>
    );
  }

  if (done) {
    const pct = Math.round((100 * correct) / all.length);
    return (
      <Overlay onClose={onClose}>
        <div className="p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            {pct >= 60 ? (
              <DoodleCheck className="h-10 w-10" />
            ) : (
              <DoodleTarget className="h-10 w-10" />
            )}
          </div>
          <h2 className="text-xl font-bold">
            {correct}/{all.length} on “{section.title}”
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {pct >= 80
              ? "Solid — this section is sticking."
              : pct >= 60
                ? "Good — one more read-through would lock it in."
                : "Worth another pass before moving on."}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setI(0);
                setPicked(null);
                setCorrect(0);
                setDone(false);
              }}
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            <Button onClick={() => onComplete({ correct, total: all.length })}>
              Continue to next section <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quiz this section
          </div>
          <div className="font-semibold">{section.title}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums text-muted-foreground">
            {i + 1} / {all.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {q.scenario && (
          <span className="mb-2 inline-block rounded-full bg-accent-2/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-2">
            Scenario — generated from this section
          </span>
        )}
        <p className="text-[15px] font-medium leading-relaxed">{q.prompt}</p>
        <div className="mt-4 space-y-2">
          {q.choices.map((c, idx) => {
            const isCorrect = picked != null && idx === q.correctIndex;
            const isWrongPick = picked === idx && idx !== q.correctIndex;
            return (
              <button
                key={idx}
                onClick={() => pick(idx)}
                disabled={picked != null}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-colors",
                  picked == null && "hover:border-primary/50 hover:bg-accent",
                  isCorrect && "border-green-500 bg-green-500/10",
                  isWrongPick && "border-destructive bg-destructive/10",
                )}
              >
                {c}
                {isCorrect && <Check className="h-4 w-4 shrink-0 text-green-600" />}
              </button>
            );
          })}
        </div>
        {picked != null && (
          <div className="mt-4 flex items-start justify-between gap-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {q.explanation ?? ""}
            </p>
            <Button size="sm" onClick={next} className="shrink-0">
              {i + 1 >= all.length ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Overlay>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {children}
      </div>
    </div>
  );
}
