"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { markdownToHtml } from "./markdown";

type Highlight = { text: string; color: string };

const HILITES = [
  { name: "Yellow", value: "rgba(250,204,21,0.45)" },
  { name: "Green", value: "rgba(34,197,94,0.40)" },
  { name: "Pink", value: "rgba(236,72,153,0.38)" },
  { name: "Blue", value: "rgba(59,130,246,0.35)" },
  { name: "Orange", value: "rgba(247,148,29,0.45)" },
];

function load(key: string): Highlight[] {
  try {
    const raw = localStorage.getItem(`ps_hl_${key}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function save(key: string, hls: Highlight[]) {
  localStorage.setItem(`ps_hl_${key}`, JSON.stringify(hls));
}

/** Wrap the first occurrence of `text` inside `el` in a styled <mark>. */
function wrapFirst(el: HTMLElement, text: string, idx: number, color: string) {
  if (!text) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue || !n.nodeValue.includes(text))
        return NodeFilter.FILTER_REJECT;
      if ((n.parentElement as HTMLElement | null)?.closest("mark.ps-hl"))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const node = walker.nextNode() as Text | null;
  if (!node || !node.nodeValue) return;
  const i = node.nodeValue.indexOf(text);
  if (i === -1) return;
  const range = document.createRange();
  range.setStart(node, i);
  range.setEnd(node, i + text.length);
  const mark = document.createElement("mark");
  mark.className = "ps-hl rounded px-0.5 cursor-pointer transition-colors";
  mark.dataset.i = String(idx);
  mark.style.backgroundColor = color;
  mark.style.color = "inherit";
  try {
    range.surroundContents(mark);
  } catch {
    /* selection spanned elements — skip */
  }
}

/**
 * A Notion-style reading surface: renders the section as clean notes and lets
 * the learner highlight any text (select → pick a colour) and re-colour or
 * remove a highlight by clicking it. Highlights persist per section.
 */
export function NotesReader({
  content,
  storageKey,
  className,
}: {
  content: string;
  storageKey: string;
  className?: string;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const [hls, setHls] = React.useState<Highlight[]>([]);
  const [addBar, setAddBar] = React.useState<{ x: number; y: number; text: string } | null>(null);
  const [editMenu, setEditMenu] = React.useState<{ x: number; y: number; idx: number } | null>(null);

  React.useEffect(() => {
    setHls(load(storageKey));
  }, [storageKey]);

  // Render markdown + (re)apply highlights imperatively so we control the DOM.
  React.useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.innerHTML = markdownToHtml(content);
    hls.forEach((h, i) => wrapFirst(el, h.text, i, h.color));
  }, [content, hls]);

  function persist(next: Highlight[]) {
    setHls(next);
    save(storageKey, next);
  }

  function rectInWrap(rect: DOMRect) {
    const w = wrapRef.current!.getBoundingClientRect();
    return { x: rect.left - w.left + rect.width / 2, y: rect.top - w.top };
  }

  function onMouseUp() {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";
    setEditMenu(null);
    if (!sel || !text || text.length < 2 || text.length > 240) {
      setAddBar(null);
      return;
    }
    // selection must be inside our body
    if (!bodyRef.current?.contains(sel.anchorNode)) {
      setAddBar(null);
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const { x, y } = rectInWrap(rect);
    setAddBar({ x, y, text });
  }

  function onClick(e: React.MouseEvent) {
    const mark = (e.target as HTMLElement).closest("mark.ps-hl") as HTMLElement | null;
    if (!mark) {
      setEditMenu(null);
      return;
    }
    e.preventDefault();
    const idx = Number(mark.dataset.i);
    const { x, y } = rectInWrap(mark.getBoundingClientRect());
    setAddBar(null);
    setEditMenu({ x, y, idx });
  }

  function addHighlight(color: string) {
    if (!addBar) return;
    persist([...hls, { text: addBar.text, color }]);
    setAddBar(null);
    window.getSelection()?.removeAllRanges();
  }
  function recolor(color: string) {
    if (!editMenu) return;
    const next = hls.slice();
    if (next[editMenu.idx]) next[editMenu.idx] = { ...next[editMenu.idx], color };
    persist(next);
    setEditMenu(null);
  }
  function removeHighlight() {
    if (!editMenu) return;
    persist(hls.filter((_, i) => i !== editMenu.idx));
    setEditMenu(null);
  }

  return (
    <div ref={wrapRef} className="relative" onMouseUp={onMouseUp} onClick={onClick}>
      <div ref={bodyRef} className={cn("space-y-3 [&_mark.ps-hl:hover]:brightness-95", className)} />

      {/* Add-highlight toolbar on selection */}
      {addBar && (
        <Popover x={addBar.x} y={addBar.y}>
          <span className="mr-1 text-xs text-muted-foreground">Highlight</span>
          {HILITES.map((h) => (
            <Swatch key={h.value} color={h.value} title={h.name} onClick={() => addHighlight(h.value)} />
          ))}
        </Popover>
      )}

      {/* Edit existing highlight */}
      {editMenu && (
        <Popover x={editMenu.x} y={editMenu.y}>
          {HILITES.map((h) => (
            <Swatch key={h.value} color={h.value} title={h.name} onClick={() => recolor(h.value)} />
          ))}
          <button
            onClick={removeHighlight}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
            title="Remove highlight"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Popover>
      )}
    </div>
  );
}

function Popover({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute z-30 flex -translate-x-1/2 -translate-y-[calc(100%+8px)] items-center gap-1 rounded-xl border bg-card p-1.5 shadow-lg"
      style={{ left: x, top: y }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

function Swatch({
  color,
  title,
  onClick,
}: {
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="h-6 w-6 rounded-md border border-black/10 transition-transform hover:scale-110"
      style={{ backgroundColor: color }}
    />
  );
}
