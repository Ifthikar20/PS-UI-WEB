/**
 * Custom marketing glyphs — a consistent, hand-drawn SVG set used across the
 * landing page instead of emojis. All are stroke-based on a 24px grid, inherit
 * `currentColor`, and take a `className` for sizing/tinting. The soft fills
 * use the current color at low opacity so the set works on any surface.
 */

type GlyphProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Pip-as-bird — the Flappy Pip mark. */
export function BirdGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <path
        d="M5 13.5c0-4 2.9-7 7-7 3.6 0 6.5 2.6 6.5 6.2 0 3.9-3 6.3-6.8 6.3H5.2c-1 0-1.5-1.2-.8-1.9l1.4-1.4A7.6 7.6 0 0 1 5 13.5Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M18.5 12.7 21 12l-2.4-1.1" />
      <circle cx="14.6" cy="10.4" r="0.4" fill="currentColor" stroke="none" />
      <path d="M8.5 12.5c1.8-.6 3.4-.4 4.6.6-1 1.4-2.6 2-4.6 1.7" />
    </svg>
  );
}

/** Rocket — Space Shooter. */
export function RocketGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <path
        d="M12 3c3 1.8 4.5 4.8 4.5 8.4 0 1.5-.3 2.9-.8 4.1h-7.4a10.7 10.7 0 0 1-.8-4.1C7.5 7.8 9 4.8 12 3Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <circle cx="12" cy="9.5" r="1.7" />
      <path d="M8.3 15.5 6 18.2c-.3.4 0 .9.4.9h11.2c.4 0 .7-.5.4-.9l-2.3-2.7" />
      <path d="M12 19.5v1.8M10 19.8l-.6 1.4M14 19.8l.6 1.4" />
    </svg>
  );
}

/** Bolt — Quiz Rush. */
export function BoltGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <path
        d="M13.2 3 6.5 13h4.3l-.9 8 6.6-10.5h-4.2L13.2 3Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  );
}

/** Bubbles — Word Pop. */
export function BubblesGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <circle cx="10" cy="10" r="5.5" fill="currentColor" fillOpacity="0.12" />
      <circle cx="17.5" cy="15.5" r="3" fill="currentColor" fillOpacity="0.12" />
      <circle cx="7.5" cy="19" r="1.6" />
      <path d="M7.6 8.5A2.8 2.8 0 0 1 10 7.2" />
    </svg>
  );
}

/** Stacked cards — Flashcard Sprint. */
export function CardsGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <rect
        x="7"
        y="7"
        width="13"
        height="12"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M4.5 15.5v-9A2.5 2.5 0 0 1 7 4h9" />
      <path d="M10.5 11h6M10.5 14.5h3.5" />
    </svg>
  );
}

/** Check/cross split — True / False Blitz. */
export function JudgeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M12 5v14" strokeDasharray="2 2.4" />
      <path d="m6.4 12 1.6 1.7L11 10.5" />
      <path d="m14.6 10.3 3.2 3.4M17.8 10.3l-3.2 3.4" />
    </svg>
  );
}

/** Trophy — scores & ranks. */
export function TrophyGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <path
        d="M8 4h8v5a4 4 0 0 1-8 0V4Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M8 6H5.5a0 0 0 0 0 0 0c0 2.4 1 3.9 2.7 4.4M16 6h2.5c0 2.4-1 3.9-2.7 4.4" />
      <path d="M12 13v3.2M9.5 19.5c.4-2 1.3-3.3 2.5-3.3s2.1 1.3 2.5 3.3H9.5Z" />
    </svg>
  );
}

/** Notes/pen — capture material. */
export function NotesGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <rect
        x="4.5"
        y="3.5"
        width="12"
        height="17"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M8 8h5M8 11.5h5M8 15h3" />
      <path d="m14.5 17.5 5-5 1.8 1.8-5 5-2.3.5.5-2.3Z" />
    </svg>
  );
}

/** Timer ring — focus sessions. */
export function TimerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <circle
        cx="12"
        cy="13"
        r="7.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M12 9.5V13l2.6 1.8" />
      <path d="M10 3.5h4M12 3.5v2" />
    </svg>
  );
}

/** Calendar with paced dots — exam prep. */
export function PlanGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      <circle cx="8" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
      <path d="m7 17 1.2 1.2L10.5 16" />
    </svg>
  );
}

/** Two devices with a flowing link — sync. */
export function SyncGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <rect
        x="2.5"
        y="5"
        width="12"
        height="9"
        rx="2"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M6.5 17.5h4" />
      <rect
        x="16"
        y="9"
        width="5.5"
        height="9.5"
        rx="1.6"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M18.4 16.6h.7" />
    </svg>
  );
}

/** Branching path — the learning tree. */
export function PathGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <circle cx="5.5" cy="18.5" r="2" fill="currentColor" fillOpacity="0.12" />
      <circle cx="12" cy="8" r="2.4" fill="currentColor" fillOpacity="0.12" />
      <circle cx="18.5" cy="15.5" r="2" fill="currentColor" fillOpacity="0.12" />
      <path d="M7 17 10.4 9.8M13.6 9.9l3.6 4" />
      <path d="M12 5.6V3.5" />
    </svg>
  );
}

/** Guardian eye/heart — family progress. */
export function FamilyGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden>
      <circle cx="9" cy="8.5" r="3" fill="currentColor" fillOpacity="0.12" />
      <path d="M3.8 19c.6-3 2.7-4.8 5.2-4.8 1 0 2 .3 2.8.8" />
      <circle cx="16.5" cy="10" r="2.3" fill="currentColor" fillOpacity="0.12" />
      <path d="M13.9 18.6c.4-2.2 1.9-3.6 3.8-3.4 1.5.1 2.7 1.3 3.2 3.1" />
    </svg>
  );
}

/** Apple mark for store links. */
export function AppleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 384 512" className={className} fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}
