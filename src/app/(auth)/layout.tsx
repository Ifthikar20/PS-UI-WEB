import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { Pip } from "@/components/pip";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NotesGlyph,
  BirdGlyph,
  TrophyGlyph,
  SyncGlyph,
} from "@/components/marketing/glyphs";

const BULLETS = [
  { Icon: NotesGlyph, text: "Notes, links & PDFs become study sets" },
  { Icon: BirdGlyph, text: "An arcade powered by your own questions" },
  { Icon: TrophyGlyph, text: "Streaks, ranks, and personal bests" },
  { Icon: SyncGlyph, text: "Everything syncs to the iPhone app" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel — a sheet of paper with pinned study scraps. */}
      <aside className="bg-paper relative hidden w-[46%] flex-col justify-between overflow-hidden border-r p-12 lg:flex">
        {/* faint grid over the paper */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--border)/0.55)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.55)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(80%_70%_at_30%_20%,black,transparent)]"
        />
        {/* pinned scrap, for character */}
        <div className="pointer-events-none absolute right-10 top-28 hidden w-40 rotate-[5deg] animate-wiggle rounded-xl border bg-card p-3.5 shadow-lg [--wiggle-base:5deg] xl:block">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Round 3
          </div>
          <div className="mt-1 flex items-center justify-between text-sm font-semibold">
            New best · 31
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Check className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div className="relative">
          <Logo href="/" />
        </div>

        <div className="relative">
          <div className="mb-7 inline-flex animate-float rounded-3xl border bg-background/80 p-4 shadow-sm backdrop-blur [animation-duration:6s]">
            <Pip size={88} />
          </div>
          <h1 className="max-w-md text-balance text-4xl font-semibold leading-tight tracking-tight">
            Study with Pip.
            <span className="font-serif italic text-primary"> Make it stick.</span>
          </h1>
          <ul className="mt-9 space-y-3.5">
            {BULLETS.map((b, i) => (
              <li
                key={b.text}
                style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                className="flex animate-fade-in items-center gap-3 text-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border bg-background/80">
                  <b.Icon className="h-5 w-5 text-primary" />
                </span>
                {b.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} PlayStudy
        </p>
      </aside>

      {/* Form side */}
      <div className="relative flex flex-1 flex-col">
        {/* small screens: a slim paper band up top keeps the theme */}
        <div
          aria-hidden
          className="bg-paper absolute inset-x-0 top-0 h-40 [mask-image:linear-gradient(to_bottom,black_35%,transparent)] lg:hidden"
        />
        <header className="container relative flex h-16 items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <Logo href="/" size={30} />
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </header>
        <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
