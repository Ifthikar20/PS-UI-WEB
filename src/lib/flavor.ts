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
  {
    label: string;
    blurb: string;
    /** The flavor's primary + accent, for swatch previews (from design tokens). */
    swatch: [string, string];
  }
> = {
  playful: {
    label: "Playful",
    blurb: "Colorful and game-first — great for younger learners.",
    swatch: ["#7C5CFB", "#FB8A1C"],
  },
  focus: {
    label: "Focus",
    blurb: "Clean and stat-forward with a study timer up top.",
    swatch: ["#6B5CE7", "#F7941D"],
  },
  pro: {
    label: "Pro",
    blurb: "Refined and professional for university and beyond.",
    swatch: ["#414BB4", "#BC7F38"],
  },
  rose: {
    label: "Rose",
    blurb: "The Focus layout in a softer pink palette.",
    swatch: ["#EC4899", "#A06CE4"],
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
