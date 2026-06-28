import type { GameManifestEntry, StudySet } from "./types";

/** base64url-encode a JSON value the way the PlayStudy SDK decodes it. */
export function encodePayloadParam(value: unknown): string {
  const json = JSON.stringify(value ?? []);
  const utf8 = new TextEncoder().encode(json);
  let binary = "";
  utf8.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Build the absolute bundle URL for a game, matching the games_host layout. */
export function gameBundleUrl(
  game: Pick<GameManifestEntry, "slug" | "version">,
  gamesBaseUrl: string,
  payload?: { quiz?: unknown; words?: unknown },
): string {
  const base = `${gamesBaseUrl}/games/${game.slug}/${game.version}/index.html`;
  if (!payload) return base;
  const params = new URLSearchParams();
  if (payload.quiz) params.set("quiz", encodePayloadParam(payload.quiz));
  if (payload.words) params.set("words", encodePayloadParam(payload.words));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** Derive the {quiz, words} payload a game expects from a study set. */
export function payloadFromStudySet(set: StudySet | null) {
  return {
    quiz: set?.quiz ?? [],
    words: set?.wordGame ?? [],
  };
}

/** Convert a Flutter cover color ("0xFFRRGGBB") to CSS hex ("#RRGGBB"). */
function toHex(c: string): string {
  const m = /^0x[0-9a-fA-F]{2}([0-9a-fA-F]{6})$/.exec(c);
  if (m) return `#${m[1]}`;
  return /^#?[0-9a-fA-F]{6}$/.test(c) ? (c.startsWith("#") ? c : `#${c}`) : c;
}

/** A retro arcade cover gradient derived from the game's cover colors. */
export function coverGradient(colors?: string[]): string {
  const list = (colors ?? []).map(toHex).filter(Boolean);
  if (list.length >= 2)
    return `linear-gradient(135deg, ${list[0]}, ${list[1]})`;
  if (list.length === 1)
    return `linear-gradient(135deg, ${list[0]}, ${list[0]})`;
  return "linear-gradient(135deg, #6B5CE7, #F7941D)";
}

/** A keycap + the action it triggers, shown on each game's controls strip. */
export type GameControl = { keys: string[]; action: string };

/**
 * Per-game control schemes. The keys are wired in playstudy-sdk.js (keyboard
 * layer maps them to each game's on-screen actions); click/tap always works too.
 */
export const GAME_CONTROLS: Record<string, GameControl[]> = {
  "quiz-rush": [
    { keys: ["1", "2", "3", "4"], action: "Pick answer" },
    { keys: ["Enter"], action: "Play again" },
  ],
  "true-false": [
    { keys: ["T", "←"], action: "True" },
    { keys: ["F", "→"], action: "False" },
  ],
  "word-pop": [{ keys: ["1", "2", "3", "4"], action: "Pick word" }],
  "flashcard-sprint": [
    { keys: ["Space"], action: "Flip card" },
    { keys: ["G", "↑"], action: "Got it" },
    { keys: ["M", "↓"], action: "Missed" },
  ],
  flappy: [
    { keys: ["Space", "↑"], action: "Flap" },
    { keys: ["1", "2", "3", "4"], action: "Answer to revive" },
  ],
  "space-shooter": [
    { keys: ["←", "→"], action: "Move" },
    { keys: ["Space"], action: "Fire" },
    { keys: ["1", "2", "3", "4"], action: "Answer" },
  ],
};

export function controlsFor(slug: string): GameControl[] {
  return (
    GAME_CONTROLS[slug] ?? [{ keys: ["Click"], action: "Play" }]
  );
}
