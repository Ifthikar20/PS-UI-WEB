import type * as React from "react";
import { Reveal } from "./reveal";
import {
  BirdGlyph,
  RocketGlyph,
  BoltGlyph,
  JudgeGlyph,
  BubblesGlyph,
  CardsGlyph,
} from "./glyphs";

/**
 * The arsenal — the real games that ship with PlayStudy, with what each one
 * trains and how it's played. Mirrors the seeded games manifest.
 */
const ARSENAL: {
  Icon: (p: { className?: string }) => React.JSX.Element;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  trains: string;
  how: string;
  keys: string[];
  tint: string;
  featured?: boolean;
}[] = [
  {
    Icon: BirdGlyph,
    name: "Flappy Pip",
    difficulty: "Medium",
    trains: "Recall under pressure",
    how: "Fly Pip through the gaps. Crash, and a question from your set is the only way back into the air — three revives per run.",
    keys: ["Space", "Tap"],
    tint: "text-accent-2",
    featured: true,
  },
  {
    Icon: RocketGlyph,
    name: "Space Shooter",
    difficulty: "Hard",
    trains: "Sustained focus",
    how: "Clear waves of invaders; answering correctly launches the next wave. Bosses every fifth wave.",
    keys: ["←", "→", "Space"],
    tint: "text-primary",
  },
  {
    Icon: BoltGlyph,
    name: "Quiz Rush",
    difficulty: "Medium",
    trains: "Speed & accuracy",
    how: "Every question is on a timer — answer before the bar runs out to keep the streak alive.",
    keys: ["1", "2", "3", "4"],
    tint: "text-amber-500",
  },
  {
    Icon: JudgeGlyph,
    name: "True / False Blitz",
    difficulty: "Easy",
    trains: "Fast judgement",
    how: "Statements fly by; call each one true or false before the next arrives.",
    keys: ["T", "F"],
    tint: "text-emerald-500",
  },
  {
    Icon: BubblesGlyph,
    name: "Word Pop",
    difficulty: "Medium",
    trains: "Term recognition",
    how: "Read the clue, pop the matching word before the wrong ones crowd it out.",
    keys: ["1", "2", "3", "4"],
    tint: "text-sky-500",
  },
  {
    Icon: CardsGlyph,
    name: "Flashcard Sprint",
    difficulty: "Easy",
    trains: "Honest self-testing",
    how: "See the clue, recall the answer, then grade yourself — got it or missed it.",
    keys: ["Space", "G", "M"],
    tint: "text-violet-500",
  },
];

function Keycap({ k }: { k: string }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-b-2 bg-secondary px-1.5 text-[10px] font-semibold text-muted-foreground">
      {k}
    </span>
  );
}

export function GamesArsenal() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ARSENAL.map((g, i) => (
        <Reveal key={g.name} delay={i * 70} className={g.featured ? "sm:col-span-2 lg:col-span-1" : ""}>
          <div className="group flex h-full flex-col rounded-3xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/[0.05]">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <g.Icon className={`h-7 w-7 ${g.tint}`} />
              </span>
              <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g.difficulty}
              </span>
            </div>
            <h3 className="mt-4 font-semibold tracking-tight">{g.name}</h3>
            <div className="mt-0.5 text-xs font-medium text-primary">{g.trains}</div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {g.how}
            </p>
            <div className="mt-4 flex items-center gap-1.5 border-t pt-3.5">
              {g.keys.map((k) => (
                <Keycap key={k} k={k} />
              ))}
              <span className="ml-1 text-[11px] text-muted-foreground">or tap</span>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
