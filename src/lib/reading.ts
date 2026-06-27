"use client";

import * as React from "react";

export type ReaderFont = "sans" | "serif" | "notes";
export type ReaderSize = "sm" | "md" | "lg";

export const FONT_LABELS: Record<ReaderFont, string> = {
  sans: "Sans",
  serif: "Serif",
  notes: "Notes",
};

const FONT_KEY = "ps_reader_font";
const SIZE_KEY = "ps_reader_size";

/** Reader typography preferences, persisted to localStorage. */
export function useReading() {
  const [font, setFontState] = React.useState<ReaderFont>("serif");
  const [size, setSizeState] = React.useState<ReaderSize>("md");

  React.useEffect(() => {
    const f = localStorage.getItem(FONT_KEY) as ReaderFont | null;
    const s = localStorage.getItem(SIZE_KEY) as ReaderSize | null;
    if (f) setFontState(f);
    if (s) setSizeState(s);
  }, []);

  const setFont = React.useCallback((f: ReaderFont) => {
    localStorage.setItem(FONT_KEY, f);
    setFontState(f);
  }, []);
  const setSize = React.useCallback((s: ReaderSize) => {
    localStorage.setItem(SIZE_KEY, s);
    setSizeState(s);
  }, []);

  return { font, setFont, size, setSize };
}

export const FONT_CLASS: Record<ReaderFont, string> = {
  sans: "font-sans",
  serif: "font-serif",
  notes: "font-notes",
};

export const SIZE_CLASS: Record<ReaderSize, string> = {
  sm: "text-[15px] leading-7",
  md: "text-[17px] leading-8",
  lg: "text-[19px] leading-9",
};
