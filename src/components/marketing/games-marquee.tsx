/**
 * Infinite marquee of the 2D arcade lineup — the games identity of the
 * platform, scrolling as one continuous strip (content duplicated once; the
 * animation translates -50% for a seamless loop). Pauses on hover.
 */
const GAMES = [
  { emoji: "🐤", name: "Flappy Pip", tag: "answer to revive", grad: "from-orange-400 to-rose-500" },
  { emoji: "🚀", name: "Space Shooter", tag: "answer to launch waves", grad: "from-violet-500 to-indigo-950" },
  { emoji: "⚡", name: "Quiz Rush", tag: "beat the clock", grad: "from-lime-400 to-violet-600" },
  { emoji: "✅", name: "True / False Blitz", tag: "rapid judgement", grad: "from-indigo-400 to-violet-700" },
  { emoji: "🫧", name: "Word Pop", tag: "pop the right word", grad: "from-emerald-400 to-teal-700" },
  { emoji: "⭐", name: "Flashcard Sprint", tag: "recall & grade yourself", grad: "from-violet-400 to-indigo-800" },
];

function Tile({ g }: { g: (typeof GAMES)[number] }) {
  return (
    <div
      className={`flex w-56 shrink-0 flex-col justify-between rounded-2xl bg-gradient-to-br ${g.grad} p-5 text-white shadow-lg transition-transform hover:-translate-y-1.5 hover:scale-[1.03]`}
    >
      <span className="text-5xl drop-shadow-[0_3px_8px_rgba(0,0,0,.35)]">{g.emoji}</span>
      <div className="mt-6">
        <div className="font-bold leading-tight">{g.name}</div>
        <div className="text-xs text-white/75">{g.tag}</div>
      </div>
    </div>
  );
}

export function GamesMarquee() {
  const strip = [...GAMES, ...GAMES];
  return (
    <div className="group relative overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-4 py-2 group-hover:[animation-play-state:paused]">
        {strip.map((g, i) => (
          <Tile key={`${g.name}-${i}`} g={g} />
        ))}
      </div>
    </div>
  );
}
