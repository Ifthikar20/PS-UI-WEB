"use client";

import * as React from "react";
import { api } from "./api";

const FLUSH_SECONDS = 30; // post at most every 30s
const IDLE_MS = 60_000; // count time only if active within the last minute

/**
 * Measures *active* reading time on the page (tab visible AND recent
 * scroll/move/key activity) and posts it to progress/heartbeat so study time
 * is tracked server-side — the same signal the mobile app sends. Flushes on
 * unmount and when the tab is hidden.
 */
export function useStudyHeartbeat(
  studySetId: string | undefined,
  sectionIndex: number,
  sectionTitle: string,
) {
  const sectionRef = React.useRef({ index: sectionIndex, title: sectionTitle });
  sectionRef.current = { index: sectionIndex, title: sectionTitle };
  const pending = React.useRef(0);
  const lastActivity = React.useRef(Date.now());

  React.useEffect(() => {
    if (!studySetId) return;

    const bump = () => (lastActivity.current = Date.now());
    const events = ["scroll", "mousemove", "keydown", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    const flush = () => {
      const secs = Math.min(pending.current, 600);
      if (secs <= 0) return;
      pending.current = 0;
      api
        .post("progress/heartbeat/", {
          studySetId,
          sectionIndex: sectionRef.current.index,
          sectionTitle: sectionRef.current.title,
          seconds: secs,
        })
        .catch(() => {});
    };

    const tick = setInterval(() => {
      const active =
        document.visibilityState === "visible" &&
        Date.now() - lastActivity.current < IDLE_MS;
      if (active) pending.current += 1;
      if (pending.current >= FLUSH_SECONDS) flush();
    }, 1000);

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onHide);
      events.forEach((e) => window.removeEventListener(e, bump));
      flush();
    };
  }, [studySetId]);
}
