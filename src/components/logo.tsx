import Link from "next/link";
import { cn } from "@/lib/utils";
import { Pip } from "./pip";

/** PlayStudy logo: Pip the mascot + wordmark. */
export function Logo({
  className,
  href = "/",
  showText = true,
  size = 34,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
  size?: number;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-bold", className)}
    >
      <span className="flex items-center justify-center rounded-xl bg-primary/10 p-1">
        <Pip size={size} />
      </span>
      {showText && (
        <span className="text-lg tracking-tight">PlayStudy</span>
      )}
    </Link>
  );
}
