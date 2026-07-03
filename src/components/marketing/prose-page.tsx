import { Reveal } from "./reveal";

/** Standard header + measure for the standalone marketing pages. */
export function ProsePage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl">
      <Reveal>
        <span className="rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>
        )}
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </Reveal>
    </article>
  );
}
