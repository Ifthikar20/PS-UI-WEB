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
