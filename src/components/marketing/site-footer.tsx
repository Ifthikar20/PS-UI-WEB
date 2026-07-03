import Link from "next/link";
import { Logo } from "@/components/logo";
import { AppStoreBadge } from "./app-store-badge";

/**
 * Marketing footer — brand column plus real link columns. Every route linked
 * here exists (about, contact, privacy, terms, help are actual pages).
 */
const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#film" },
      { label: "Live demo", href: "/#demo" },
      { label: "Features", href: "/#features" },
      { label: "Learning journey", href: "/#journey" },
    ],
  },
  {
    // The arcade lineup we promote — each links into the games section.
    title: "Games",
    links: [
      { label: "Quiz Rush", href: "/#games" },
      { label: "Flappy Quiz", href: "/#games" },
      { label: "Word Pop", href: "/#games" },
      { label: "True / False Blitz", href: "/#games" },
      { label: "Flashcard Sprint", href: "/#games" },
      { label: "Space Shooter", href: "/#games" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          {/* brand */}
          <div>
            <Logo size={28} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The arcade that studies with you — notes in, games out, progress
              everywhere.
            </p>
            <div className="mt-5">
              <AppStoreBadge />
            </div>
          </div>
          {/* link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="h-px w-0 bg-foreground transition-all duration-300 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} PlayStudy · playstudy.ai
          </p>
          <p>Made with Pip, for learners who&apos;d rather be playing.</p>
        </div>
      </div>
    </footer>
  );
}
