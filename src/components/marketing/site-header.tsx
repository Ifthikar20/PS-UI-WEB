"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#film", label: "How it works" },
  { href: "#games", label: "Games" },
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Live demo" },
];

/**
 * Floating capsule navigation — detached from the page edge, glassy, and it
 * tightens (smaller padding, stronger blur ring) once the visitor scrolls.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={cn(
          "flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border bg-background/70 pl-5 pr-2 backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "h-14 shadow-lg shadow-black/[0.06] dark:shadow-black/30"
            : "h-16 shadow-sm",
        )}
      >
        <Logo size={26} className="shrink-0" />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all hover:gap-2.5 hover:pr-4"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
