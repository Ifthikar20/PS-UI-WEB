"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Sunset } from "lucide-react";
import { useSession } from "./session-provider";
import { cn } from "@/lib/utils";

/**
 * Eye-comfort ("night light") control: a tiny dropdown next to the theme
 * toggle with a warmth slider. Sliding it up tints the whole app the classic
 * yellow-orange of an eye-saver mode; sliding to zero returns to a pure,
 * untinted screen. The tint is a full-viewport multiply overlay, so it warms
 * colors without washing out text, and it never intercepts clicks.
 *
 * Persists locally for instant restore and syncs to the account preferences
 * so it follows the user across devices.
 */

const KEY = "ps_warmth"; // 0..100
const MAX_ALPHA = 0.38; // tint strength at 100
const TINT = "255, 147, 41"; // classic night-light amber

export function WarmthControl() {
  const { getPref, savePref } = useSession();
  const [warmth, setWarmth] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore: localStorage instantly, then the synced preference wins.
  React.useEffect(() => {
    try {
      const local = Number(localStorage.getItem(KEY));
      if (Number.isFinite(local) && local > 0) setWarmth(clamp(local));
    } catch {
      /* ignore */
    }
    const synced = getPref<number | null>("warmth", null);
    if (typeof synced === "number") setWarmth(clamp(synced));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function apply(next: number) {
    const v = clamp(next);
    setWarmth(v);
    try {
      localStorage.setItem(KEY, String(v));
    } catch {
      /* ignore */
    }
    // Debounce the server sync so dragging doesn't spam requests.
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => savePref("warmth", v), 500);
  }

  return (
    <>
      {/* The tint itself — above everything, invisible to the mouse. Rendered
          into <body> via a portal: the topbar's backdrop-blur would otherwise
          trap this fixed element inside the header. */}
      {mounted &&
        warmth > 0 &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[200]"
            style={{
              backgroundColor: `rgba(${TINT}, ${(warmth / 100) * MAX_ALPHA})`,
              mixBlendMode: "multiply",
            }}
          />,
          document.body,
        )}

      <div ref={wrapRef} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Eye comfort"
          aria-expanded={open}
          className={cn(
            "flex h-10 items-center gap-0.5 rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            (open || warmth > 0) && "text-foreground",
          )}
        >
          <Sunset className={cn("h-5 w-5", warmth > 0 && "text-orange-500")} />
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border bg-popover p-4 shadow-lg">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Eye comfort</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {warmth === 0 ? "Off" : `${warmth}%`}
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              Warms the screen to a gentle amber. Slide to zero for a pure
              white screen.
            </p>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={warmth}
              onChange={(e) => apply(Number(e.target.value))}
              aria-label="Screen warmth"
              className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:shadow"
              style={{
                background: `linear-gradient(to right, hsl(var(--muted-foreground)/0.25), rgb(${TINT}))`,
              }}
            />
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>Pure white</span>
              <span>Warm</span>
            </div>
            <div className="mt-3 flex gap-1.5">
              {[0, 25, 50, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => apply(v)}
                  className={cn(
                    "flex-1 rounded-lg border py-1 text-xs transition-colors hover:bg-accent",
                    warmth === v && "border-orange-400 bg-orange-500/10 font-medium",
                  )}
                >
                  {v === 0 ? "Off" : `${v}%`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function clamp(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)));
}
