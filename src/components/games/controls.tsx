import { MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlsFor } from "@/lib/games";

/** A single retro keycap. */
export function Keycap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-[1.4rem] items-center justify-center rounded-md border border-b-2 border-border bg-secondary px-1.5 py-0.5 text-[11px] font-semibold leading-none text-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** The control scheme for a game — keycaps + what each does. */
export function GameControls({
  slug,
  compact = false,
  className,
}: {
  slug: string;
  compact?: boolean;
  className?: string;
}) {
  const controls = controlsFor(slug);
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", className)}>
      {controls.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {c.keys.map((k, j) => (
            <Keycap key={j}>{k}</Keycap>
          ))}
          {!compact && (
            <span className="ml-1 text-[11px] text-muted-foreground">
              {c.action}
            </span>
          )}
        </span>
      ))}
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <MousePointerClick className="h-3 w-3" /> or tap
      </span>
    </div>
  );
}
