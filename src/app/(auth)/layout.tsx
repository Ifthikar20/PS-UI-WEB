import Link from "next/link";
import { ArrowLeft, Sparkles, Gamepad2, Trophy } from "lucide-react";
import { Logo } from "@/components/logo";
import { Pip } from "@/components/pip";
import { ThemeToggle } from "@/components/theme-toggle";

const BULLETS = [
  { icon: Sparkles, text: "Turn notes, links & PDFs into study sets" },
  { icon: Gamepad2, text: "Play arcade games powered by your own questions" },
  { icon: Trophy, text: "Build streaks and climb the ranks with Pip" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
      {/* Brand panel with the mascot — hidden on small screens. */}
      <aside className="brand-wash relative hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <Logo href="/" />
        <div>
          <div className="mb-6 inline-flex rounded-3xl bg-background/70 p-4 shadow-sm backdrop-blur">
            <Pip size={96} />
          </div>
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Study with Pip.
            <br />
            Make it stick.
          </h1>
          <ul className="mt-8 space-y-3">
            {BULLETS.map((b) => (
              <li key={b.text} className="flex items-center gap-3 text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70">
                  <b.icon className="h-4 w-4 text-primary" />
                </span>
                {b.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PlayStudy
        </p>
      </aside>

      {/* Form side */}
      <div className="flex flex-1 flex-col">
        <header className="container flex h-16 items-center justify-between lg:justify-end">
          <span className="lg:hidden">
            <Logo href="/" size={30} />
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
