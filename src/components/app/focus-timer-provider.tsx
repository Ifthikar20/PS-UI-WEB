"use client";

import * as React from "react";
import { api } from "@/lib/api";

/**
 * A dynamic, activity-aware study timer shared across the whole app.
 *
 * It is NOT a wall clock: time only counts down while you're actually using
 * the platform. If there's no interaction (scroll / click / key / move) for
 * IDLE_PAUSE, it auto-pauses with a reason; any interaction resumes it. After
 * a long continuous focus stretch it suggests a break. Breaks aren't
 * idle-paused (you're meant to step away).
 */
const IDLE_PAUSE_MS = 6 * 60 * 1000; // pause after ~6 min of no interaction
const DEFAULT_MIN = 25;
const BREAK_MIN = 5;
const BREAK_AFTER_SEC = 45 * 60; // suggest a break after 45 active focus min
const MIN_MINUTES = 1;
const MAX_MINUTES = 180;

type Mode = "focus" | "break";

type FocusTimerValue = {
  minutes: number;
  mode: Mode;
  secondsLeft: number;
  running: boolean;
  idle: boolean;
  pauseReason: string | null;
  breakSuggested: boolean;
  setMinutes: (m: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  startBreak: () => void;
  dismissBreak: () => void;
};

const Ctx = React.createContext<FocusTimerValue | null>(null);

export function FocusTimerProvider({ children }: { children: React.ReactNode }) {
  const [minutes, setMinutesState] = React.useState(DEFAULT_MIN);
  const [mode, setMode] = React.useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = React.useState(DEFAULT_MIN * 60);
  const [running, setRunning] = React.useState(false);
  const [idle, setIdle] = React.useState(false);
  const [pauseReason, setPauseReason] = React.useState<string | null>(null);
  const [breakSuggested, setBreakSuggested] = React.useState(false);

  // Runtime mirrors so the 1s interval reads fresh values without resetting.
  const runningRef = React.useRef(false);
  const modeRef = React.useRef<Mode>("focus");
  const idleRef = React.useRef(false);
  const secondsRef = React.useRef(secondsLeft);
  const minutesRef = React.useRef(minutes);
  const activeFocusRef = React.useRef(0);
  const lastActivity = React.useRef(Date.now());

  const setSeconds = (n: number) => {
    secondsRef.current = n;
    setSecondsLeft(n);
  };

  const complete = React.useCallback(() => {
    if (modeRef.current === "focus") {
      api
        .post("rewards/activity/", {
          reason: "Study session",
          context: { minutes: minutesRef.current },
        })
        .catch(() => {});
      modeRef.current = "break";
      setMode("break");
      activeFocusRef.current = 0;
      setBreakSuggested(false);
      setSeconds(BREAK_MIN * 60); // keep running through the break
    } else {
      modeRef.current = "focus";
      setMode("focus");
      runningRef.current = false;
      setRunning(false);
      setSeconds(minutesRef.current * 60);
    }
  }, []);

  // Single ticking loop.
  React.useEffect(() => {
    const id = setInterval(() => {
      if (!runningRef.current) return;
      const now = Date.now();
      const visible = document.visibilityState === "visible";
      const active = visible && now - lastActivity.current < IDLE_PAUSE_MS;

      // Idle auto-pause applies to focus only (breaks are meant to be away).
      if (modeRef.current === "focus" && !active) {
        if (!idleRef.current) {
          idleRef.current = true;
          setIdle(true);
          setPauseReason(
            visible
              ? "Paused — no activity for a while. Scroll or click to resume."
              : "Paused — this tab is in the background. Come back to resume.",
          );
        }
        return;
      }
      if (idleRef.current) {
        idleRef.current = false;
        setIdle(false);
        setPauseReason(null);
      }

      const next = secondsRef.current - 1;
      setSeconds(next);
      if (modeRef.current === "focus") {
        activeFocusRef.current += 1;
        if (
          activeFocusRef.current > 0 &&
          activeFocusRef.current % BREAK_AFTER_SEC === 0
        ) {
          setBreakSuggested(true);
        }
      }
      if (next <= 0) complete();
    }, 1000);
    return () => clearInterval(id);
  }, [complete]);

  // Global interaction tracking — any platform activity resumes a paused timer.
  React.useEffect(() => {
    const bump = () => {
      lastActivity.current = Date.now();
      if (runningRef.current && idleRef.current && modeRef.current === "focus") {
        idleRef.current = false;
        setIdle(false);
        setPauseReason(null);
      }
    };
    const events = ["scroll", "mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    document.addEventListener("visibilitychange", bump);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      document.removeEventListener("visibilitychange", bump);
    };
  }, []);

  const setMinutes = React.useCallback((m: number) => {
    const clamped = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, Math.round(m) || 0));
    minutesRef.current = clamped;
    setMinutesState(clamped);
    if (!runningRef.current && modeRef.current === "focus") {
      setSeconds(clamped * 60);
    }
  }, []);

  const start = React.useCallback(() => {
    if (secondsRef.current <= 0) setSeconds(minutesRef.current * 60);
    lastActivity.current = Date.now(); // don't trip idle immediately
    idleRef.current = false;
    setIdle(false);
    setPauseReason(null);
    runningRef.current = true;
    setRunning(true);
  }, []);

  const pause = React.useCallback(() => {
    runningRef.current = false;
    setRunning(false);
  }, []);

  const reset = React.useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    modeRef.current = "focus";
    setMode("focus");
    idleRef.current = false;
    setIdle(false);
    setPauseReason(null);
    setBreakSuggested(false);
    activeFocusRef.current = 0;
    setSeconds(minutesRef.current * 60);
  }, []);

  const startBreak = React.useCallback(() => {
    modeRef.current = "break";
    setMode("break");
    activeFocusRef.current = 0;
    setBreakSuggested(false);
    setSeconds(BREAK_MIN * 60);
    lastActivity.current = Date.now();
    runningRef.current = true;
    setRunning(true);
  }, []);

  const dismissBreak = React.useCallback(() => {
    activeFocusRef.current = 0; // re-arm: suggest again after another stretch
    setBreakSuggested(false);
  }, []);

  const value: FocusTimerValue = {
    minutes,
    mode,
    secondsLeft,
    running,
    idle,
    pauseReason,
    breakSuggested,
    setMinutes,
    start,
    pause,
    reset,
    startBreak,
    dismissBreak,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFocusTimer() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useFocusTimer must be used within FocusTimerProvider");
  return ctx;
}

export function formatClock(seconds: number) {
  const s = Math.max(0, seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
