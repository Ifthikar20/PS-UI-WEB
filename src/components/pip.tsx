import { cn } from "@/lib/utils";

/**
 * Pip — PlayStudy's mascot, an orange-and-white pup. Recreated here as an SVG
 * (the mobile app draws him procedurally) so he scales crisply as the logo.
 * Palette matches lib/features/games/native/mascot.dart.
 */
export function Pip({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Pip the PlayStudy pup"
    >
      <g
        stroke="#1A1A1A"
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Ears (behind head) */}
        <path
          d="M19 16 C10 14 7 24 12 31 C16 28 20 24 22 19 Z"
          fill="#E07A12"
        />
        <path
          d="M45 16 C54 14 57 24 52 31 C48 28 44 24 42 19 Z"
          fill="#E07A12"
        />
        {/* Head */}
        <path
          d="M32 13 C44 13 51 22 51 33 C51 45 43 52 32 52 C21 52 13 45 13 33 C13 22 20 13 32 13 Z"
          fill="#F7941D"
        />
        {/* Muzzle / face patch */}
        <ellipse cx="32" cy="40" rx="13" ry="10" fill="#FFFFFF" />
        {/* Nose */}
        <ellipse cx="32" cy="35.5" rx="3.4" ry="2.6" fill="#1A1A1A" />
        {/* Mouth */}
        <path d="M32 38 C32 41 29 43 27 42" fill="none" />
        <path d="M32 38 C32 41 35 43 37 42" fill="none" />
      </g>
      {/* Eyes (no outline) */}
      <circle cx="25" cy="30" r="2.8" fill="#1A1A1A" />
      <circle cx="39" cy="30" r="2.8" fill="#1A1A1A" />
      <circle cx="26" cy="29" r="0.9" fill="#FFFFFF" />
      <circle cx="40" cy="29" r="0.9" fill="#FFFFFF" />
    </svg>
  );
}
