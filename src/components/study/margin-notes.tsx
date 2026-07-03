"use client";

import * as React from "react";
import { PenLine } from "lucide-react";

/**
 * Editable margin notes — the "write in your notebook" area under each
 * section. Autosaves locally per set+section (device-local scratch space,
 * like pencil in a real notebook).
 */
export function MarginNotes({ storageKey }: { storageKey: string }) {
  const key = `ps_note_${storageKey}`;
  const [value, setValue] = React.useState("");
  const [saved, setSaved] = React.useState(true);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    try {
      setValue(localStorage.getItem(key) ?? "");
    } catch {
      /* ignore */
    }
  }, [key]);

  // Autosave (debounced) + auto-grow.
  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
    if (saved) return;
    const id = setTimeout(() => {
      try {
        if (value.trim()) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      setSaved(true);
    }, 400);
    return () => clearTimeout(id);
  }, [value, saved, key]);

  return (
    <div className="mt-5 border-t border-dashed pt-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <PenLine className="h-3.5 w-3.5" /> My notes
        </span>
        <span className="text-[10px] text-muted-foreground">
          {saved ? "saved on this device" : "saving…"}
        </span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        placeholder="Scribble your own takeaways here…"
        rows={2}
        className="w-full resize-none bg-transparent font-notes text-[15px] leading-8 text-foreground/85 outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
