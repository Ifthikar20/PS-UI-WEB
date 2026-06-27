"use client";

import * as React from "react";
import { useSession } from "@/components/app/session-provider";

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
    if (f) local.setFont(f);
    if (s) local.setSize(s);
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

  return { font: local.font, size: local.size, setFont, setSize };
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
