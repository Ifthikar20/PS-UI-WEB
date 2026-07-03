import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal, dependency-free Markdown renderer tuned for study notes.
 * Supports: # ## ### headings, **bold**, *italic*, ++underline++,
 * ==highlight==, `code`, [links](url), > blockquotes, and - / 1. lists.
 * Content is HTML-escaped before any inline formatting is applied, so it is
 * safe to render.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  let t = escapeHtml(text);
  t = t.replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-[0.85em]">$1</code>');
  t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline underline-offset-2">$1</a>',
  );
  t = t.replace(/==([^=]+)==/g, '<mark class="rounded bg-accent2/25 px-1 text-foreground">$1</mark>');
  // ++underline++ — an emphasis markdown lacks natively but study notes want.
  t = t.replace(/\+\+([^+]+)\+\+/g, '<u class="underline decoration-2 underline-offset-2">$1</u>');
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  t = t.replace(/_([^_]+)_/g, "<em>$1</em>");
  return t;
}

type Block =
  | { type: "h"; level: number; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string };

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ type: "h", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (/^>\s?/.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: parts.join(" ") });
      continue;
    }
    // Paragraph: gather consecutive non-blank, non-special lines.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s|[-*]\s|\d+\.\s|>\s?)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: para.join(" ") });
  }
  return blocks;
}

const H_CLASS: Record<number, string> = {
  1: "mt-6 mb-2 text-2xl font-bold tracking-tight",
  2: "mt-6 mb-2 text-xl font-semibold tracking-tight",
  3: "mt-5 mb-1.5 text-lg font-semibold",
  4: "mt-4 mb-1 text-base font-semibold",
  5: "mt-4 mb-1 text-base font-semibold",
  6: "mt-4 mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
};

/** Render markdown to an HTML string (shared by <Markdown> and the notes reader). */
export function markdownToHtml(md: string): string {
  const blocks = parse(md || "");
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === "h") {
      const lvl = Math.min(b.level + 1, 6);
      out.push(`<h${lvl} class="${H_CLASS[b.level]}">${inline(b.text)}</h${lvl}>`);
    } else if (b.type === "ul") {
      out.push(
        `<ul class="list-disc space-y-1.5 pl-6 marker:text-muted-foreground">${b.items
          .map((it) => `<li>${inline(it)}</li>`)
          .join("")}</ul>`,
      );
    } else if (b.type === "ol") {
      out.push(
        `<ol class="list-decimal space-y-1.5 pl-6 marker:text-muted-foreground">${b.items
          .map((it) => `<li>${inline(it)}</li>`)
          .join("")}</ol>`,
      );
    } else if (b.type === "quote") {
      out.push(
        `<blockquote class="border-l-2 border-primary/40 pl-4 italic text-muted-foreground">${inline(b.text)}</blockquote>`,
      );
    } else {
      out.push(`<p>${inline(b.text)}</p>`);
    }
  }
  return out.join("");
}

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const html = React.useMemo(() => markdownToHtml(content), [content]);
  return (
    <div
      className={cn("space-y-3", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
