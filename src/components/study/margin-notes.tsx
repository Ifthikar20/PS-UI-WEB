"use client";

import * as React from "react";
import { PenLine, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editable margin notes — the "write in your notebook" area under each
 * section. Notes come in colours (like a pack of pens/stickies) and autosave
 * locally per set+section (device-local scratch space, like pencil in a real
 * notebook).
 */

type Note = { text: string; color: NoteColor };
type NoteColor = "yellow" | "blue" | "green" | "pink" | "purple";

const COLORS: Record<
  NoteColor,
  { name: string; bg: string; ink: string; dot: string }
> = {
  yellow: {
    name: "Yellow",
    bg: "bg-amber-100/70 dark:bg-amber-500/10",
    ink: "text-amber-950 dark:text-amber-200",
    dot: "bg-amber-400",
  },
  blue: {
    name: "Blue",
    bg: "bg-sky-100/70 dark:bg-sky-500/10",
    ink: "text-sky-950 dark:text-sky-200",
    dot: "bg-sky-400",
  },
  green: {
    name: "Green",
    bg: "bg-emerald-100/70 dark:bg-emerald-500/10",
    ink: "text-emerald-950 dark:text-emerald-200",
    dot: "bg-emerald-400",
  },
  pink: {
    name: "Pink",
    bg: "bg-pink-100/70 dark:bg-pink-500/10",
    ink: "text-pink-950 dark:text-pink-200",
    dot: "bg-pink-400",
  },
  purple: {
    name: "Purple",
    bg: "bg-violet-100/70 dark:bg-violet-500/10",
    ink: "text-violet-950 dark:text-violet-200",
    dot: "bg-violet-400",
  },
};
const COLOR_KEYS = Object.keys(COLORS) as NoteColor[];

function load(storageKey: string): Note[] {
  try {
    const raw = localStorage.getItem(`ps_notes_${storageKey}`);
    if (raw) return JSON.parse(raw);
    // migrate the old single-note format
    const legacy = localStorage.getItem(`ps_note_${storageKey}`);
    if (legacy) return [{ text: legacy, color: "yellow" }];
  } catch {
    /* ignore */
  }
  return [];
}

function store(storageKey: string, notes: Note[]) {
  try {
    const kept = notes.filter((n) => n.text.trim());
    if (kept.length) {
      localStorage.setItem(`ps_notes_${storageKey}`, JSON.stringify(kept));
    } else {
      localStorage.removeItem(`ps_notes_${storageKey}`);
    }
    localStorage.removeItem(`ps_note_${storageKey}`);
  } catch {
    /* ignore */
  }
}

export function MarginNotes({ storageKey }: { storageKey: string }) {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [saved, setSaved] = React.useState(true);

  React.useEffect(() => {
    setNotes(load(storageKey));
    setSaved(true);
  }, [storageKey]);

  // Autosave (debounced).
  React.useEffect(() => {
    if (saved) return;
    const id = setTimeout(() => {
      store(storageKey, notes);
      setSaved(true);
    }, 400);
    return () => clearTimeout(id);
  }, [notes, saved, storageKey]);

  function update(i: number, patch: Partial<Note>) {
    setNotes((prev) => prev.map((n, j) => (j === i ? { ...n, ...patch } : n)));
    setSaved(false);
  }
  function remove(i: number) {
    setNotes((prev) => prev.filter((_, j) => j !== i));
    setSaved(false);
  }
  function add() {
    setNotes((prev) => [
      ...prev,
      // rotate through the pen colours so new notes vary naturally
      { text: "", color: COLOR_KEYS[prev.length % COLOR_KEYS.length] },
    ]);
    setSaved(false);
  }

  return (
    <div className="mt-5 border-t border-dashed pt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <PenLine className="h-3.5 w-3.5" /> My notes
        </span>
        <span className="text-[10px] text-muted-foreground">
          {saved ? "saved on this device" : "saving…"}
        </span>
      </div>

      <div className="space-y-2">
        {notes.map((note, i) => (
          <NoteCard
            key={i}
            note={note}
            onChange={(patch) => update(i, patch)}
            onRemove={() => remove(i)}
          />
        ))}
      </div>

      <button
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" /> Add a note
      </button>
    </div>
  );
}

function NoteCard({
  note,
  onChange,
  onRemove,
}: {
  note: Note;
  onChange: (patch: Partial<Note>) => void;
  onRemove: () => void;
}) {
  const c = COLORS[note.color] ?? COLORS.yellow;
  const ref = React.useRef<HTMLTextAreaElement>(null);

  // Auto-grow with content.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [note.text]);

  return (
    <div className={cn("group rounded-xl px-3 py-2", c.bg)}>
      <textarea
        ref={ref}
        value={note.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Scribble your own takeaways here…"
        rows={1}
        autoFocus={!note.text}
        className={cn(
          "w-full resize-none bg-transparent font-notes text-[15px] leading-7 outline-none placeholder:text-muted-foreground/60",
          c.ink,
        )}
      />
      <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        {COLOR_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => onChange({ color: k })}
            title={`${COLORS[k].name} pen`}
            className={cn(
              "h-4 w-4 rounded-full transition-transform hover:scale-110",
              COLORS[k].dot,
              note.color === k && "ring-2 ring-foreground/40 ring-offset-1 ring-offset-transparent",
            )}
          />
        ))}
        <button
          onClick={onRemove}
          title="Delete note"
          className="ml-auto flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
