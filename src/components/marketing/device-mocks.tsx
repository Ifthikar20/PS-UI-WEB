import Image from "next/image";
import { Flame, Star, Play } from "lucide-react";
import { Pip } from "@/components/pip";
import dashboardShot from "../../../docs/screenshots/dashboard.png";

/**
 * CSS device mockups for the landing split-screen: an iPhone running the
 * mobile app (built from primitives so it stays theme-aware and crisp) and a
 * browser window running the real web dashboard (product screenshot).
 */

const MINI_GAMES = [
  { emoji: "🐤", bg: "bg-orange-100 dark:bg-orange-950/50" },
  { emoji: "🚀", bg: "bg-violet-100 dark:bg-violet-950/50" },
  { emoji: "⚡", bg: "bg-yellow-100 dark:bg-yellow-950/50" },
  { emoji: "🫧", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
];

export function PhoneMock() {
  return (
    <div className="relative mx-auto w-[250px] rounded-[42px] border-[10px] border-zinc-900 bg-background shadow-2xl dark:border-zinc-700">
      {/* notch */}
      <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-900 dark:bg-zinc-700" />
      <div className="overflow-hidden rounded-[32px]">
        <div className="space-y-3 p-4 pt-9">
          {/* app header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pip size={26} />
              <span className="text-sm font-bold">PlayStudy</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">
              <Flame className="h-3 w-3 text-accent-2" /> 6
            </span>
          </div>
          {/* streak / points */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border p-2.5">
              <div className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                Points
              </div>
              <div className="flex items-center gap-1 text-base font-extrabold">
                <Star className="h-3.5 w-3.5 text-yellow-500" /> 245
              </div>
            </div>
            <div className="rounded-xl border p-2.5">
              <div className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                Rank
              </div>
              <div className="text-base font-extrabold">Explorer</div>
            </div>
          </div>
          {/* study set card */}
          <div className="rounded-xl border p-3">
            <div className="text-[10px] text-muted-foreground">Continue studying</div>
            <div className="mt-0.5 text-xs font-semibold">Cell Biology — Ch. 4</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
          {/* arcade row */}
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Arcade
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MINI_GAMES.map((g) => (
                <div
                  key={g.emoji}
                  className={`flex aspect-square items-center justify-center rounded-xl text-xl ${g.bg}`}
                >
                  {g.emoji}
                </div>
              ))}
            </div>
          </div>
          {/* play button */}
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground">
            <Play className="h-3.5 w-3.5 fill-current" /> Play today&apos;s round
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrowserMock() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 flex-1 truncate rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground">
          playstudy.app/dashboard
        </span>
      </div>
      <Image
        src={dashboardShot}
        alt="The PlayStudy web dashboard"
        className="w-full"
        placeholder="blur"
        sizes="(min-width: 1024px) 560px, 100vw"
      />
    </div>
  );
}
