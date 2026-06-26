/**
 * Dashboard "flavors" — the app re-skins itself to suit the learner, chosen in
 * the sign-up questionnaire and switchable later in Settings.
 *
 *   playful — high school & younger: vivid, colorful, gamified
 *   focus   — college: plain, stat-forward, study timer on top (default)
 *   pro     — university & above: refined, professional
 *   rose    — pink alternative to focus
 */
export const FLAVORS = ["playful", "focus", "pro", "rose"] as const;
export type Flavor = (typeof FLAVORS)[number];

export const DEFAULT_FLAVOR: Flavor = "focus";
export const FLAVOR_COOKIE = "ps_flavor";

export type EduLevel = "school" | "college" | "university";

export const FLAVOR_META: Record<
  Flavor,
  { label: string; blurb: string; emoji: string }
> = {
  playful: {
    label: "Playful",
    blurb: "Colorful and game-first — great for younger learners.",
    emoji: "🎈",
  },
  focus: {
    label: "Focus",
    blurb: "Clean and stat-forward with a study timer up top.",
    emoji: "🎯",
  },
  pro: {
    label: "Pro",
    blurb: "Refined and professional for university and beyond.",
    emoji: "🎓",
  },
  rose: {
    label: "Rose",
    blurb: "The Focus layout in a softer pink palette.",
    emoji: "🌸",
  },
};

export function isFlavor(value: unknown): value is Flavor {
  return typeof value === "string" && (FLAVORS as readonly string[]).includes(value);
}

/** Map a questionnaire answer to a flavor. */
export function flavorForLevel(level: EduLevel, pink = false): Flavor {
  if (level === "school") return "playful";
  if (level === "university") return "pro";
  return pink ? "rose" : "focus"; // college
}

// --- client cookie helpers -------------------------------------------------
export function readFlavorCookie(): Flavor | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${FLAVOR_COOKIE}=`));
  const value = match ? decodeURIComponent(match.split("=")[1]) : null;
  return isFlavor(value) ? value : null;
}

export function writeFlavorCookie(flavor: Flavor) {
  if (typeof document === "undefined") return;
  // 1-year, readable (UI preference, not a secret), same-site.
  document.cookie = `${FLAVOR_COOKIE}=${flavor}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
