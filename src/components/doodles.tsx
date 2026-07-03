import type * as React from "react";

/**
 * Doodles — the app's custom "emoji" set. Hand-drawn sticker icons in the
 * mascot's heavy-ink style: a playful fill behind an irregular dark outline,
 * deliberate wobble and asymmetry (no perfect circles), a slight tilt, and a
 * white shine. Used for decorative moments (stat tiles, celebrations,
 * activity), NOT for functional UI icons — those stay crisp line icons.
 *
 * All inherit sizing from className; colors are baked in like stickers so
 * they read identically in light and dark themes.
 */

type DoodleProps = { className?: string };

const ink = {
  stroke: "#1A1A1A",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Wobbly five-point star, gold. */
export function DoodleStar({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-7 16 16)">
        <path
          d="M16 3.4 L19.6 11 L27.8 12.1 L21.8 17.9 L23.5 26.2 L16.2 22.3 L8.6 26 L10.4 17.7 L4.4 11.8 L12.7 10.9 Z"
          fill="#FFD23F"
          {...ink}
          strokeWidth="2"
        />
        <ellipse cx="12.2" cy="10.6" rx="1.7" ry="1" fill="#fff" opacity="0.85" transform="rotate(-18 12.2 10.6)" />
      </g>
    </svg>
  );
}

/** Crooked little flame, two-tone. */
export function DoodleFlame({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(4 16 16)">
        <path
          d="M16.6 3.2 C18.4 7.4 22.9 9.6 23.6 14.6 C24.3 19.6 21.3 25.8 15.7 26.2 C10.3 26.6 6.9 21.9 7.5 17.2 C7.9 14 9.9 12.2 11.4 9.9 C11.9 11.5 12.6 12.4 13.9 13.2 C13.5 9.5 14.6 6 16.6 3.2 Z"
          fill="#FF7B2C"
          {...ink}
          strokeWidth="2"
        />
        <path
          d="M16.1 15.3 C17.6 17 19.2 18.3 18.9 20.8 C18.6 23.1 16.9 24.3 15.2 24.2 C13.3 24.1 11.9 22.5 12.1 20.4 C12.3 18.2 14.6 17.2 16.1 15.3 Z"
          fill="#FFD23F"
          stroke="#1A1A1A"
          strokeWidth="1.6"
        />
        <ellipse cx="12.4" cy="12.6" rx="1.2" ry="1.9" fill="#fff" opacity="0.7" transform="rotate(14 12.4 12.6)" />
      </g>
    </svg>
  );
}

/** Slightly lopsided trophy, gold cup. */
export function DoodleTrophy({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-4 16 16)">
        <path d="M9.4 5.6 C9.1 11.2 9.9 16.8 15.9 17 C22 16.8 22.9 11 22.6 5.3 C18.2 5 13.8 5.1 9.4 5.6 Z" fill="#FFD23F" {...ink} strokeWidth="2" />
        <path d="M9.5 7.6 C6.9 7.9 5.3 9.2 5.6 11.4 C5.9 13.6 7.8 14.6 10.1 14.7" fill="none" {...ink} strokeWidth="1.8" />
        <path d="M22.5 7.3 C25.1 7.5 26.8 8.8 26.5 11 C26.2 13.3 24.2 14.3 21.9 14.5" fill="none" {...ink} strokeWidth="1.8" />
        <path d="M15.9 17 L15.7 20.6" {...ink} strokeWidth="2" />
        <path d="M11.6 25.9 C12.2 22.8 13.8 20.5 15.8 20.5 C17.9 20.5 19.5 22.9 20.1 26.2 C17.3 26.5 14.4 26.4 11.6 25.9 Z" fill="#F7941D" {...ink} strokeWidth="2" />
        <ellipse cx="12.6" cy="8.4" rx="1.3" ry="2" fill="#fff" opacity="0.75" transform="rotate(12 12.6 8.4)" />
      </g>
    </svg>
  );
}

/** Egg-shaped clock with honest hands. */
export function DoodleClock({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(5 16 16)">
        <path
          d="M16.3 5.1 C22.4 5.2 26.6 9.7 26.4 15.7 C26.2 21.9 21.6 26.3 15.7 26.1 C9.9 25.9 5.6 21.3 5.8 15.4 C6 9.6 10.4 5 16.3 5.1 Z"
          fill="#BFEFFF"
          {...ink}
          strokeWidth="2"
        />
        <path d="M16.1 9.4 L15.9 15.9 L20.6 18.4" fill="none" {...ink} strokeWidth="2.2" />
        <path d="M13.2 3.4 L10 4.6 M18.9 3.3 L22.1 4.4" {...ink} strokeWidth="2" />
        <ellipse cx="11.4" cy="9.8" rx="1.6" ry="2.4" fill="#fff" opacity="0.8" transform="rotate(24 11.4 9.8)" />
      </g>
    </svg>
  );
}

/** Chunky check swoosh on a squashed badge. */
export function DoodleCheck({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-5 16 16)">
        <path
          d="M16.5 4.9 C23 5.2 27.2 9.4 26.9 15.6 C26.6 21.9 22 26.4 15.6 26.1 C9.4 25.8 5.2 21.4 5.5 15.2 C5.8 9.1 10.2 4.6 16.5 4.9 Z"
          fill="#34D399"
          {...ink}
          strokeWidth="2"
        />
        <path d="M10.7 15.9 L14.4 19.8 C16.6 16.5 18.8 13.9 21.7 11.6" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="11.2" cy="9.3" rx="1.7" ry="1.1" fill="#fff" opacity="0.65" transform="rotate(-16 11.2 9.3)" />
      </g>
    </svg>
  );
}

/** Uneven rings target with a proud bullseye. */
export function DoodleTarget({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(3 16 16)">
        <path
          d="M16.2 4.6 C23.1 4.8 27.5 9.6 27.2 16.1 C26.9 22.6 21.9 27.2 15.6 26.9 C9.3 26.6 4.8 21.8 5.1 15.5 C5.4 9.2 9.9 4.4 16.2 4.6 Z"
          fill="#FF5A6E"
          {...ink}
          strokeWidth="2"
        />
        <path
          d="M16.1 9.3 C20 9.4 22.6 12.2 22.4 15.9 C22.2 19.7 19.3 22.4 15.7 22.2 C12 22 9.5 19.2 9.7 15.6 C9.9 12 12.5 9.2 16.1 9.3 Z"
          fill="#fff"
          stroke="#1A1A1A"
          strokeWidth="1.7"
        />
        <path
          d="M16 13.4 C17.7 13.5 18.7 14.6 18.6 16.1 C18.5 17.7 17.3 18.8 15.8 18.7 C14.3 18.6 13.3 17.4 13.4 15.9 C13.5 14.5 14.5 13.3 16 13.4 Z"
          fill="#FF5A6E"
          stroke="#1A1A1A"
          strokeWidth="1.6"
        />
        <ellipse cx="11.6" cy="8.9" rx="1.6" ry="1" fill="#fff" opacity="0.7" transform="rotate(-20 11.6 8.9)" />
      </g>
    </svg>
  );
}

/** Open book with a bent spine. */
export function DoodleBook({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-3 16 16)">
        <path
          d="M16 8.1 C13.2 5.9 9.4 5.3 5.3 5.9 C5 11.4 5.1 16.9 5.5 22.4 C9.5 21.9 13.3 22.4 16 24.6 C18.8 22.3 22.6 21.8 26.6 22.3 C26.9 16.8 26.9 11.3 26.5 5.8 C22.5 5.3 18.7 6 16 8.1 Z"
          fill="#8A7EFA"
          {...ink}
          strokeWidth="2"
        />
        <path d="M16 8.1 C16 13.6 16 19.1 16 24.6" fill="none" {...ink} strokeWidth="1.8" />
        <path d="M8.4 10.1 C10.2 9.9 11.9 10.1 13.4 10.9 M8.5 13.6 C10.3 13.4 11.9 13.7 13.4 14.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M18.7 10.8 C20.2 10.1 21.9 9.9 23.6 10 M18.7 14.3 C20.2 13.7 21.8 13.5 23.5 13.6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.9" />
      </g>
    </svg>
  );
}

/** Four-point sparkle with a sidekick. */
export function DoodleSpark({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(6 16 16)">
        <path
          d="M15.6 4.2 C16.8 8.6 18.4 11.2 22.8 12.4 C18.5 13.9 16.6 16.4 15.9 21 C14.6 16.5 12.9 14 8.6 12.9 C12.8 11.5 14.6 8.9 15.6 4.2 Z"
          fill="#B39DFF"
          {...ink}
          strokeWidth="2"
        />
        <path
          d="M24.2 18.6 C24.8 20.7 25.6 21.9 27.6 22.5 C25.6 23.2 24.7 24.4 24.3 26.6 C23.7 24.4 22.9 23.2 20.9 22.7 C22.9 22 23.7 20.8 24.2 18.6 Z"
          fill="#FFD23F"
          stroke="#1A1A1A"
          strokeWidth="1.7"
        />
        <ellipse cx="13.6" cy="9.6" rx="1.1" ry="1.6" fill="#fff" opacity="0.8" transform="rotate(18 13.6 9.6)" />
      </g>
    </svg>
  );
}

/** Sticker registry for spots that pick a doodle by key. */
export const DOODLES: Record<string, (p: DoodleProps) => React.JSX.Element> = {
  star: DoodleStar,
  flame: DoodleFlame,
  trophy: DoodleTrophy,
  clock: DoodleClock,
  check: DoodleCheck,
  target: DoodleTarget,
  book: DoodleBook,
  spark: DoodleSpark,
};
