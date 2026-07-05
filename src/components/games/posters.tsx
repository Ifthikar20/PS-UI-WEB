import type * as React from "react";
import { Gamepad2 } from "lucide-react";
import { coverGradient } from "@/lib/games";

/**
 * Custom game posters — illustrated scene art for each arcade game, drawn as
 * SVG so it ships in kilobytes, scales crisply, and needs no image pipeline.
 * Each poster mirrors its game's actual in-canvas art (same palettes and
 * shapes the bundles draw), so the tile is a truthful preview of play.
 *
 * To swap any poster for generated raster art later: drop the image in
 * public/posters/<slug>.png and replace that slug's entry in GAME_POSTERS
 * with an <Image> — this file is the single registry the UI reads.
 */

function FlappyPoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="fp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4EC0F7" />
          <stop offset="0.6" stopColor="#9BD9FB" />
          <stop offset="1" stopColor="#BFEFFF" />
        </linearGradient>
        <linearGradient id="fp-pipe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2FAE5E" />
          <stop offset="0.5" stopColor="#52D784" />
          <stop offset="1" stopColor="#2FAE5E" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#fp-sky)" />
      {/* sun + clouds */}
      <circle cx="332" cy="52" r="26" fill="#FFF1B0" opacity="0.95" />
      <g fill="#fff" opacity="0.85">
        <ellipse cx="86" cy="60" rx="34" ry="14" />
        <ellipse cx="112" cy="52" rx="24" ry="11" />
        <ellipse cx="268" cy="112" rx="28" ry="11" opacity="0.7" />
      </g>
      {/* pipes */}
      <g fill="url(#fp-pipe)" stroke="#1F8A48" strokeWidth="2">
        <rect x="66" y="-6" width="52" height="110" rx="6" />
        <rect x="60" y="96" width="64" height="16" rx="5" />
        <rect x="66" y="196" width="52" height="120" rx="6" />
        <rect x="60" y="188" width="64" height="16" rx="5" />
        <rect x="296" y="-6" width="52" height="60" rx="6" />
        <rect x="290" y="46" width="64" height="16" rx="5" />
        <rect x="296" y="150" width="52" height="160" rx="6" />
        <rect x="290" y="142" width="64" height="16" rx="5" />
      </g>
      {/* bone collectible */}
      <g transform="translate(255 108) rotate(-24)" fill="#FFF3D6" stroke="#6B5B3A" strokeWidth="2">
        <rect x="-11" y="-4" width="22" height="8" rx="4" />
        <circle cx="-12" cy="-4" r="5" />
        <circle cx="-12" cy="4" r="5" />
        <circle cx="12" cy="-4" r="5" />
        <circle cx="12" cy="4" r="5" />
      </g>
      {/* teal bird + Pip rider */}
      <g transform="translate(180 152) rotate(-8)">
        {/* far wing */}
        <ellipse cx="-18" cy="-2" rx="17" ry="9" fill="#1E928E" transform="rotate(-30)" />
        {/* body */}
        <ellipse cx="0" cy="8" rx="34" ry="24" fill="#36C5C0" stroke="#1A1A1A" strokeWidth="3" />
        <ellipse cx="4" cy="15" rx="24" ry="14" fill="#BFF3F0" />
        {/* head + beak + eye */}
        <circle cx="26" cy="-6" r="14" fill="#36C5C0" stroke="#1A1A1A" strokeWidth="3" />
        <path d="M38 -8 L52 -11 L52 -3 Z" fill="#FF9E2C" />
        <circle cx="30" cy="-9" r="2.6" fill="#1A1A1A" />
        {/* near wing */}
        <ellipse cx="-12" cy="4" rx="16" ry="8" fill="#2BB3AE" stroke="#1A1A1A" strokeWidth="2.5" transform="rotate(-18)" />
        {/* Pip riding */}
        <g transform="translate(-6 -30)">
          <rect x="-11" y="6" width="22" height="15" rx="7" fill="#F7941D" />
          <rect x="-7" y="9" width="14" height="11" rx="5" fill="#FFFFFF" />
          <circle cx="0" cy="-2" r="12" fill="#F7941D" stroke="#1A1A1A" strokeWidth="2.5" />
          <path d="M-10 -8 L-15 -20 L-4 -13 Z" fill="#F7941D" stroke="#1A1A1A" strokeWidth="2" />
          <ellipse cx="9" cy="-8" rx="4" ry="6.5" fill="#E07A12" transform="rotate(26 9 -8)" />
          <ellipse cx="0" cy="1" rx="8" ry="6.5" fill="#FFFFFF" />
          <circle cx="-3.4" cy="-2.6" r="1.7" fill="#1A1A1A" />
          <circle cx="3.4" cy="-2.6" r="1.7" fill="#1A1A1A" />
          <ellipse cx="0" cy="2.4" rx="2.3" ry="1.7" fill="#1A1A1A" />
        </g>
      </g>
      {/* motion streaks */}
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55">
        <path d="M120 142 h26" />
        <path d="M112 158 h18" />
      </g>
      {/* ground */}
      <rect y="272" width="400" height="28" fill="#8FCB6B" />
      <rect y="272" width="400" height="7" fill="#6FB24E" />
    </svg>
  );
}

function ShooterPoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#231B33" />
          <stop offset="1" stopColor="#0E0E14" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#sp-sky)" />
      {/* stars */}
      <g fill="#fff">
        {[
          [24, 40, 0.9], [88, 22, 0.5], [150, 58, 0.7], [230, 30, 0.9], [318, 48, 0.5],
          [370, 90, 0.8], [40, 130, 0.5], [350, 170, 0.6], [60, 228, 0.6], [200, 96, 0.4],
          [286, 130, 0.5], [128, 178, 0.4],
        ].map(([x, y, o], i) => (
          <circle key={i} cx={x} cy={y} r="1.8" opacity={o} />
        ))}
      </g>
      {/* planet */}
      <circle cx="352" cy="236" r="46" fill="#3A4A8C" opacity="0.6" />
      <circle cx="338" cy="222" r="30" fill="#5A6BB0" opacity="0.35" />
      {/* saucer formation */}
      {[80, 170, 260].map((x, i) => (
        <g key={i} transform={`translate(${x} ${58 + (i % 2) * 10})`} stroke="#12131A" strokeWidth="2.5">
          <ellipse cx="0" cy="4" rx="26" ry="12" fill="#8FE3B6" />
          <circle cx="0" cy="-6" r="11" fill="#B5EFD2" />
          <circle cx="0" cy="-6" r="4" fill="#12131A" stroke="none" />
        </g>
      ))}
      {/* weaver */}
      <g transform="translate(330 96)" stroke="#12131A" strokeWidth="2.5">
        <path d="M0 -16 L15 0 L0 16 L-15 0 Z" fill="#FF8AD8" />
        <circle cx="0" cy="0" r="3.4" fill="#12131A" stroke="none" />
      </g>
      {/* enemy bullets */}
      <g fill="#FF6B6E">
        <circle cx="150" cy="132" r="5" opacity="0.9" />
        <circle cx="252" cy="118" r="4" opacity="0.7" />
      </g>
      {/* player bullets */}
      <g fill="#D6F26C">
        <rect x="196" y="120" width="7" height="20" rx="3" />
        <rect x="196" y="76" width="7" height="20" rx="3" opacity="0.65" />
      </g>
      {/* player rocket with Pip */}
      <g transform="translate(200 226)">
        <path d="M-11 26 Q0 52 11 26 Z" fill="#FFD23F" />
        <path d="M-6 26 Q0 42 6 26 Z" fill="#FF7B2C" />
        <g stroke="#1A1A1A" strokeWidth="3">
          <path d="M-16 8 L-34 28 L-16 24 Z" fill="#F7941D" />
          <path d="M16 8 L34 28 L16 24 Z" fill="#F7941D" />
          <rect x="-20" y="-26" width="40" height="52" rx="17" fill="#FFFFFF" />
        </g>
        <path d="M-20 -12 A20 17 0 0 1 20 -12 L20 -16 A20 17 0 0 0 -20 -16 Z" fill="#F7941D" />
        <circle cx="0" cy="0" r="15" fill="#BFEFFF" opacity="0.9" />
        <circle cx="0" cy="-3" r="9" fill="#F7941D" />
        <circle cx="-3.2" cy="-4.6" r="1.8" fill="#1A1A1A" />
        <circle cx="3.2" cy="-4.6" r="1.8" fill="#1A1A1A" />
      </g>
    </svg>
  );
}

function QuizRushPoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="qr-bg" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#7C6CF0" />
          <stop offset="1" stopColor="#2A2352" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#qr-bg)" />
      {/* speed streaks */}
      <g stroke="#fff" strokeLinecap="round" opacity="0.25">
        <path d="M20 60 h70" strokeWidth="5" />
        <path d="M40 236 h56" strokeWidth="4" />
        <path d="M330 210 h50" strokeWidth="5" />
        <path d="M312 76 h40" strokeWidth="4" />
      </g>
      {/* timer bar */}
      <rect x="70" y="42" width="260" height="12" rx="6" fill="#fff" opacity="0.22" />
      <rect x="70" y="42" width="150" height="12" rx="6" fill="#D6F26C" />
      {/* big bolt */}
      <path
        d="M228 66 L152 172 h46 L188 252 L268 138 h-48 Z"
        fill="#D6F26C"
        stroke="#1A1A1A"
        strokeWidth="5"
        strokeLinejoin="round"
        transform="rotate(6 200 160)"
      />
      {/* answer pills */}
      <g>
        <rect x="52" y="120" width="76" height="26" rx="13" fill="#fff" opacity="0.2" />
        <rect x="44" y="168" width="76" height="26" rx="13" fill="#fff" opacity="0.14" />
        <rect x="286" y="150" width="76" height="26" rx="13" fill="#22C55E" stroke="#fff" strokeWidth="2.5" />
        <path d="M306 163 l7 7 l14 -14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="292" y="198" width="76" height="26" rx="13" fill="#fff" opacity="0.14" />
      </g>
    </svg>
  );
}

function TrueFalsePoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="tf-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="tf-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F87171" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      {/* diagonal split */}
      <path d="M0 0 H236 L164 300 H0 Z" fill="url(#tf-l)" />
      <path d="M236 0 H400 V300 H164 Z" fill="url(#tf-r)" />
      <path d="M236 0 L164 300" stroke="#fff" strokeWidth="6" opacity="0.85" />
      {/* check + cross */}
      <path d="M64 150 l30 32 l56 -62" stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="#fff" strokeWidth="18" strokeLinecap="round">
        <path d="M272 118 l64 64" />
        <path d="M336 118 l-64 64" />
      </g>
      {/* flying statement cards */}
      <g fill="#fff" opacity="0.9">
        <rect x="38" y="42" width="92" height="30" rx="9" transform="rotate(-6 84 57)" />
        <rect x="268" y="226" width="92" height="30" rx="9" transform="rotate(5 314 241)" />
      </g>
      <g fill="#94A3B8">
        <rect x="52" y="52" width="56" height="5" rx="2.5" transform="rotate(-6 80 54)" />
        <rect x="282" y="238" width="56" height="5" rx="2.5" transform="rotate(5 310 240)" />
      </g>
    </svg>
  );
}

function WordPopPoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="wp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E5F63" />
          <stop offset="1" stopColor="#052E30" />
        </linearGradient>
        <radialGradient id="wp-b" cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#B8F3EE" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2DD4BF" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#wp-bg)" />
      {/* rising bubbles with letters */}
      {[
        { x: 96, y: 190, r: 52, l: "W" },
        { x: 210, y: 120, r: 44, l: "O" },
        { x: 314, y: 196, r: 48, l: "R" },
        { x: 170, y: 246, r: 30, l: "D" },
      ].map((b) => (
        <g key={b.l}>
          <circle cx={b.x} cy={b.y} r={b.r} fill="url(#wp-b)" stroke="#8EEDE4" strokeWidth="2" opacity="0.95" />
          <circle cx={b.x - b.r * 0.32} cy={b.y - b.r * 0.36} r={b.r * 0.16} fill="#fff" opacity="0.8" />
          <text
            x={b.x}
            y={b.y + b.r * 0.22}
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
            fontSize={b.r * 0.78}
            fill="#04302C"
          >
            {b.l}
          </text>
        </g>
      ))}
      {/* popped bubble burst */}
      <g stroke="#8EEDE4" strokeWidth="4" strokeLinecap="round">
        <path d="M312 84 l-12 -12" />
        <path d="M330 78 l0 -17" />
        <path d="M348 84 l12 -12" />
        <path d="M352 102 l17 -5" />
        <path d="M308 102 l-17 -5" />
      </g>
      {/* tiny bubbles */}
      <g fill="#8EEDE4" opacity="0.5">
        <circle cx="52" cy="92" r="6" />
        <circle cx="70" cy="64" r="4" />
        <circle cx="246" cy="212" r="5" />
        <circle cx="380" cy="120" r="4" />
      </g>
    </svg>
  );
}

function FlashcardPoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="fc-bg" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#6D5FD9" />
          <stop offset="1" stopColor="#2B2560" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#fc-bg)" />
      {/* sprint lines */}
      <g stroke="#fff" strokeLinecap="round" opacity="0.3">
        <path d="M28 96 h64" strokeWidth="6" />
        <path d="M20 130 h44" strokeWidth="5" />
        <path d="M36 164 h54" strokeWidth="5" />
      </g>
      {/* fanned card stack */}
      <g transform="translate(228 158)">
        <rect x="-88" y="-64" width="176" height="124" rx="14" fill="#CBC5F2" transform="rotate(-12)" />
        <rect x="-88" y="-64" width="176" height="124" rx="14" fill="#E4E1F8" transform="rotate(-5)" />
        <g transform="rotate(3)">
          <rect x="-88" y="-64" width="176" height="124" rx="14" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3.5" />
          {/* star */}
          <path
            d="M0 -34 L9 -12 L33 -10 L15 6 L21 29 L0 16 L-21 29 L-15 6 L-33 -10 L-9 -12 Z"
            fill="#FFD23F"
            stroke="#1A1A1A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x="-56" y="38" width="112" height="7" rx="3.5" fill="#C7C2E8" />
        </g>
      </g>
      {/* stopwatch chip */}
      <g transform="translate(84 224)">
        <circle r="26" fill="#fff" opacity="0.92" />
        <circle r="26" fill="none" stroke="#1A1A1A" strokeWidth="3" />
        <path d="M0 -8 V2 L8 8" stroke="#1A1A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <rect x="-5" y="-34" width="10" height="7" rx="2" fill="#1A1A1A" />
      </g>
    </svg>
  );
}

function AnswerBucketPoster() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="ab-bg" cx="0.5" cy="0" r="1.1">
          <stop offset="0" stopColor="#7D6FF0" />
          <stop offset="0.5" stopColor="#6B5CE7" />
          <stop offset="1" stopColor="#1F1B2E" />
        </radialGradient>
        <linearGradient id="ab-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB454" />
          <stop offset="1" stopColor="#EF7F12" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#ab-bg)" />
      {/* soft glow blobs */}
      <g opacity="0.4">
        <circle cx="70" cy="70" r="60" fill="#8B7BFF" />
        <circle cx="340" cy="120" r="52" fill="#F7941D" opacity="0.7" />
      </g>
      {/* falling answer tiles — wrong ones tilted, the correct one marked ✓ */}
      <g fontFamily="system-ui, sans-serif" fontWeight="800">
        <g transform="translate(88 70) rotate(-8)">
          <rect x="-40" y="-22" width="80" height="44" rx="12" fill="#FFFFFF" opacity="0.9" />
          <text x="0" y="7" textAnchor="middle" fontSize="20" fill="#EF4444">✗</text>
        </g>
        <g transform="translate(300 96) rotate(7)">
          <rect x="-40" y="-22" width="80" height="44" rx="12" fill="#FFFFFF" opacity="0.9" />
          <text x="0" y="7" textAnchor="middle" fontSize="20" fill="#EF4444">✗</text>
        </g>
        {/* the correct tile, dropping toward the bucket */}
        <g transform="translate(196 150) rotate(-2)">
          <rect x="-46" y="-26" width="92" height="52" rx="14" fill="#D6F26C" stroke="#fff" strokeWidth="3" />
          <text x="0" y="8" textAnchor="middle" fontSize="26" fill="#1F7A34">✓</text>
        </g>
      </g>
      {/* motion streak under the correct tile */}
      <path d="M196 176 V212" stroke="#D6F26C" strokeWidth="4" strokeLinecap="round" opacity="0.5" strokeDasharray="2 9" />
      {/* the bucket */}
      <g transform="translate(200 236)">
        <ellipse cx="0" cy="-10" rx="66" ry="16" fill="#FFFFFF" opacity="0.18" />
        <path d="M-58 -10 L58 -10 L42 58 Q40 64 32 64 L-32 64 Q-40 64 -42 58 Z"
          fill="url(#ab-body)" stroke="#2A1C05" strokeWidth="4" strokeLinejoin="round" />
        <path d="M-38 -8 L-44 62 M0 -8 L0 64 M38 -8 L44 62" stroke="#2A1C05" strokeWidth="3" opacity="0.28" />
        <ellipse cx="0" cy="-10" rx="60" ry="13" fill="#FFD38A" stroke="#2A1C05" strokeWidth="4" />
      </g>
    </svg>
  );
}

export const GAME_POSTERS: Record<string, () => React.JSX.Element> = {
  "answer-bucket": AnswerBucketPoster,
  flappy: FlappyPoster,
  "space-shooter": ShooterPoster,
  "quiz-rush": QuizRushPoster,
  "true-false": TrueFalsePoster,
  "word-pop": WordPopPoster,
  "flashcard-sprint": FlashcardPoster,
};

/** A game's poster, or a quiet gradient fallback for unknown slugs. */
export function GamePoster({
  slug,
  coverColors,
}: {
  slug: string;
  coverColors?: string[];
}) {
  const Poster = GAME_POSTERS[slug];
  if (Poster) return <Poster />;
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ backgroundImage: coverGradient(coverColors) }}
    >
      <Gamepad2 className="h-12 w-12 text-white/90" />
    </div>
  );
}
