import Link from "next/link";
import { cn } from "@/lib/utils";

/** PlayStudy wordmark: a filled square monogram + name. Mono palette. */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-bold", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm">
        P
      </span>
      <span className="text-lg tracking-tight">PlayStudy</span>
    </Link>
  );
}
