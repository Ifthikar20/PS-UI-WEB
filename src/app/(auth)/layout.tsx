import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Pip } from "@/components/pip";
import {
  NotesGlyph,
  BirdGlyph,
  PlanGlyph,
  SyncGlyph,
} from "@/components/marketing/glyphs";

const FEATURES = [
  { Icon: NotesGlyph, label: "Study sets" },
  { Icon: BirdGlyph, label: "Arcade" },
  { Icon: PlanGlyph, label: "Exam prep" },
  { Icon: SyncGlyph, label: "Syncs to iPhone" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Auth is light-only by design — force light tokens even in dark mode.
    <div className="force-light flex min-h-screen bg-background text-foreground p-3 md:p-4">
      {/* Art panel — inset, rounded, brand-gradient fluid artwork. */}
      <aside className="relative hidden w-[52%] flex-col justify-between overflow-hidden rounded-[28px] p-10 text-white lg:flex xl:p-12">
        {/* fluid gradient artwork */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(135deg,#6B5CE7_0%,#B04AC8_45%,#F7941D_100%)]"
        />
        <div aria-hidden className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-fuchsia-500/60 blur-[100px]" />
        <div aria-hidden className="absolute -right-16 top-8 h-80 w-80 rounded-full bg-orange-400/70 blur-[90px]" />
        <div aria-hidden className="absolute bottom-0 left-1/3 h-72 w-[28rem] rounded-full bg-violet-700/50 blur-[110px]" />
        <div aria-hidden className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-pink-300/50 blur-[60px]" />
        {/* grain so the gradient reads as artwork, not flat CSS */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* headline */}
        <div className="relative max-w-md">
          <h1 className="text-4xl font-extrabold uppercase leading-[1.06] tracking-tight xl:text-5xl">
            Studying
            <br />
            <span className="font-light">that plays</span>
            <br />
            back
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/85">
            PlayStudy turns your notes into study sets, arcade games, and daily
            challenges — synced between the web and your phone.
          </p>
          <span className="mt-5 inline-block rounded-full border border-white/40 px-3 py-1 text-xs font-medium text-white/90">
            v1.0
          </span>
        </div>

        {/* feature strip + logo */}
        <div className="relative space-y-7">
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {FEATURES.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <f.Icon className="h-[18px] w-[18px]" /> {f.label}
              </span>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="flex items-center justify-center rounded-xl bg-white/15 p-1 backdrop-blur">
              <Pip size={30} />
            </span>
            PlayStudy
          </Link>
        </div>
      </aside>

      {/* Form side */}
      <div className="relative flex flex-1 flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* small screens keep the brand visible */}
            <Link href="/" className="mb-8 flex items-center gap-2 font-bold lg:hidden">
              <span className="flex items-center justify-center rounded-xl bg-primary/10 p-1">
                <Pip size={30} />
              </span>
              PlayStudy
            </Link>
            {children}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </div>
          </div>
        </main>
        <footer className="pb-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PlayStudy ·{" "}
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </footer>
      </div>
    </div>
  );
}
