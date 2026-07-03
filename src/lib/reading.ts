"use client";

import * as React from "react";
import { useSession } from "@/components/app/session-provider";

export type ReaderFont = "sans" | "serif" | "notes";
export type ReaderSize = "sm" | "md" | "lg";
export type ReaderPaper = "ruled" | "grid" | "plain" | "none";

export const FONT_LABELS: Record<ReaderFont, string> = {
  sans: "Sans",
  serif: "Serif",
  notes: "Notes",
};

export const PAPER_LABELS: Record<ReaderPaper, string> = {
  ruled: "Ruled",
  grid: "Grid",
  plain: "Plain",
  none: "White",
};

const FONT_KEY = "ps_reader_font";
const SIZE_KEY = "ps_reader_size";
const PAPER_KEY = "ps_reader_paper";

/** Reader typography preferences, persisted to localStorage. */
export function useReading() {
  const [font, setFontState] = React.useState<ReaderFont>("serif");
  const [size, setSizeState] = React.useState<ReaderSize>("md");
  const [paper, setPaperState] = React.useState<ReaderPaper>("ruled");

  React.useEffect(() => {
    const f = localStorage.getItem(FONT_KEY) as ReaderFont | null;
    const s = localStorage.getItem(SIZE_KEY) as ReaderSize | null;
    const pp = localStorage.getItem(PAPER_KEY) as ReaderPaper | null;
    if (f) setFontState(f);
    if (s) setSizeState(s);
    if (pp) setPaperState(pp);
  }, []);

  const setFont = React.useCallback((f: ReaderFont) => {
    localStorage.setItem(FONT_KEY, f);
    setFontState(f);
  }, []);
  const setSize = React.useCallback((s: ReaderSize) => {
    localStorage.setItem(SIZE_KEY, s);
    setSizeState(s);
  }, []);
  const setPaper = React.useCallback((pp: ReaderPaper) => {
    localStorage.setItem(PAPER_KEY, pp);
    setPaperState(pp);
  }, []);

  return { font, setFont, size, setSize, paper, setPaper };
}

/**
 * Reading prefs that also sync to the server (preferred over local on load).
 * Use inside the app shell where a session is available (e.g. the reader).
 */
export function useSyncedReading() {
  const local = useReading();
  const { getPref, savePref } = useSession();
  const hydrated = React.useRef(false);

  React.useEffect(() => {
    const f = getPref<ReaderFont | null>("readerFont", null);
    const s = getPref<ReaderSize | null>("readerSize", null);
    const pp = getPref<ReaderPaper | null>("readerPaper", null);
    if (f) local.setFont(f);
    if (s) local.setSize(s);
    if (pp) local.setPaper(pp);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFont = React.useCallback(
    (f: ReaderFont) => {
      local.setFont(f);
      savePref("readerFont", f);
    },
    [local, savePref],
  );
  const setSize = React.useCallback(
    (s: ReaderSize) => {
      local.setSize(s);
      savePref("readerSize", s);
    },
    [local, savePref],
  );

  const setPaper = React.useCallback(
    (pp: ReaderPaper) => {
      local.setPaper(pp);
      savePref("readerPaper", pp);
    },
    [local, savePref],
  );

  return {
    font: local.font,
    size: local.size,
    paper: local.paper,
    setFont,
    setSize,
    setPaper,
  };
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

/** Section-card classes per paper style (pure white = no texture at all). */
export const PAPER_CLASS: Record<ReaderPaper, { card: string; sheet: string; pad: string }> = {
  ruled: { card: "bg-paper", sheet: "notebook-sheet", pad: "py-6 pl-16 pr-6" },
  grid: { card: "bg-paper", sheet: "notebook-grid", pad: "p-6" },
  plain: { card: "bg-paper", sheet: "", pad: "p-6" },
  none: { card: "", sheet: "", pad: "p-6" },
};
