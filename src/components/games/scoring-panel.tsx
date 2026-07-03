"use client";

import * as React from "react";
import { Star, Trophy, Target } from "lucide-react";
import { readBestScore } from "@/components/games/game-host";
import { cn } from "@/lib/utils";
import type { GameManifestEntry } from "@/lib/types";

/**
 * The game page's scoring explainer: how THIS game scores (each game has its
 * own in-game system), and what a run is worth on your profile — an
 * anticipated-points ladder driven by the manifest's maxScore/rewardCap.
 * Everything shown here mirrors exactly what the server computes on
 * games/sessions/{id}/complete/ (see docs/SCORING.md).
 */

/** In-game scoring rules per bundle — mirrors the actual game code. */
const GAME_RULES: Record<string, string[]> = {
  "quiz-rush": [
    "+10 per correct answer, against the clock",
    "3 correct in a row fires a streak bonus (+5 profile pts)",
    "Wrong answers score 0 and reset your streak",
  ],
  "true-false": [
    "+10 per correct true/false call",
    "No penalty for misses — speed is the challenge",
  ],
  "word-pop": [
    "+10 per word popped from its clue",
    "Pop the wrong bubble and the word stays in play",
  ],
  "flashcard-sprint": [
    "+10 per card you grade yourself correct on",
    "Honest grading — the deck ends when you've seen every card",
  ],
  flappy: [
    "+1 per pipe gap cleared",
    "+2 per bone snack grabbed mid-flight",
    "Crash once? Answer a quiz question to revive (+2)",
  ],
  "space-shooter": [
    "+10–25 per invader, by type",
    "+150 for the boss, +5 per asteroid cleared",
    "Answer a question between waves to launch the next volley",
  ],
};

/** The share of the target score each ladder rung represents. */
const RUNGS = [0.25, 0.5, 0.75, 1];

export function ScoringPanel({ game, setId }: { game: GameManifestEntry; setId?: string | null }) {
  const target = game.maxScore ?? 0;
  const cap = game.rewardCap ?? 0;
  const rules = GAME_RULES[game.slug] ?? [];
  const [best, setBest] = React.useState(0);

  React.useEffect(() => {
    setBest(readBestScore(game.key, setId));
  }, [game.key, setId]);

  if (!target || !cap) return null;

  const pointsFor = (score: number) =>
    Math.round((cap * Math.min(score, target)) / target);
  const bestPts = pointsFor(best);

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Scoring — what a run is worth
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
          <Star className="h-3.5 w-3.5 text-yellow-500" />
          up to {cap} profile pts per run
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* How this game scores (unique per game) */}
        <div>
          <div className="mb-2 text-sm font-medium">
            How {game.name} scores
          </div>
          <ul className="space-y-1.5">
            {rules.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Anticipated profile points — proportional ladder */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">What you can earn</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5" /> target score {target.toLocaleString()}
            </span>
          </div>
          <div className="space-y-1.5">
            {RUNGS.map((f) => {
              const score = Math.round(target * f);
              const pts = pointsFor(score);
              const reached = best >= score;
              return (
                <div key={f} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-16 shrink-0 text-right text-xs tabular-nums",
                      reached ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {score.toLocaleString()}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        reached ? "bg-primary" : "bg-primary/25",
                      )}
                      style={{ width: `${f * 100}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "w-14 shrink-0 text-xs font-semibold tabular-nums",
                      reached ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    +{pts} pts
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Points scale with your score: reach the target for all {cap},
            get halfway for about half. Scores past the target still earn {cap}.
          </p>
          {best > 0 && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium">
              <Trophy className="h-3.5 w-3.5 text-accent-2" />
              Your best run ({best.toLocaleString()}) is worth ~{bestPts} pts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
