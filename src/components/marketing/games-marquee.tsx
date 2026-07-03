import type * as React from "react";
import {
  BirdGlyph,
  RocketGlyph,
  BoltGlyph,
  JudgeGlyph,
  BubblesGlyph,
  CardsGlyph,
} from "./glyphs";

/**
 * Infinite marquee of the arcade lineup — quiet, tidy tiles with the custom
 * glyph set (content duplicated once; the animation translates -50% for a
 * seamless loop). Pauses on hover.
 */
const GAMES: {
  Icon: (p: { className?: string }) => React.JSX.Element;
  name: string;
  tag: string;
  tint: string;
}[] = [
  { Icon: BirdGlyph, name: "Flappy Pip", tag: "Answer to revive", tint: "text-accent-2" },
  { Icon: RocketGlyph, name: "Space Shooter", tag: "Answer to launch the wave", tint: "text-primary" },
  { Icon: BoltGlyph, name: "Quiz Rush", tag: "Beat the clock", tint: "text-amber-500" },
  { Icon: JudgeGlyph, name: "True / False Blitz", tag: "Rapid judgement", tint: "text-emerald-500" },
  { Icon: BubblesGlyph, name: "Word Pop", tag: "Pop the right word", tint: "text-sky-500" },
  { Icon: CardsGlyph, name: "Flashcard Sprint", tag: "Recall, then grade yourself", tint: "text-violet-500" },
];

function Tile({ g }: { g: (typeof GAMES)[number] }) {
  return (
    <div className="group/tile flex w-64 shrink-0 items-center gap-4 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary transition-transform duration-300 group-hover/tile:scale-110">
        <g.Icon className={`h-7 w-7 ${g.tint}`} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{g.name}</div>
        <div className="truncate text-xs text-muted-foreground">{g.tag}</div>
      </div>
    </div>
  );
}

export function GamesMarquee() {
  const strip = [...GAMES, ...GAMES];
  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-4 py-2 group-hover:[animation-play-state:paused]">
        {strip.map((g, i) => (
          <Tile key={`${g.name}-${i}`} g={g} />
        ))}
      </div>
    </div>
  );
}
