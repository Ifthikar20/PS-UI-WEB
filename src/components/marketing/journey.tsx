import { Reveal } from "./reveal";
import { TrophyGlyph } from "./glyphs";

/**
 * The learning journey — the app's real rank ladder (mirrored from the
 * backend's rewards config), drawn as a rising path. Every study session,
 * quiz, and game round earns points; points climb this ladder.
 */
const RANKS: { name: string; at: number; note?: string }[] = [
  { name: "Novice", at: 0, note: "Everyone starts here" },
  { name: "Explorer", at: 100, note: "First sets studied, first rounds played" },
  { name: "Scholar", at: 300, note: "Streaks forming, accuracy climbing" },
  { name: "Strategist", at: 600, note: "Exam plans in motion" },
  { name: "Sage", at: 1000 },
  { name: "Master", at: 1500 },
  { name: "Legend", at: 2200, note: "The long game, won" },
];

export function Journey() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* rising baseline (desktop) */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-border via-border to-transparent lg:block"
      />
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2">
        {RANKS.map((r, i) => (
          <Reveal key={r.name} delay={i * 90}>
            <li
              className="group relative flex h-full flex-col rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-lg lg:mt-[var(--lift)]"
              style={{ "--lift": `${(RANKS.length - 1 - i) * 14}px` } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-[11px] font-bold text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  {i + 1}
                </span>
                {i === RANKS.length - 1 && (
                  <TrophyGlyph className="h-5 w-5 text-accent-2" />
                )}
              </div>
              <div className="mt-3 text-sm font-semibold tracking-tight">{r.name}</div>
              <div className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                {r.at === 0 ? "start" : `${r.at.toLocaleString()} pts`}
              </div>
              {r.note && (
                <div className="mt-2 border-t pt-2 text-[11px] leading-snug text-muted-foreground">
                  {r.note}
                </div>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
