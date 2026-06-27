"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useSession } from "./session-provider";

/**
 * Applies the server-synced theme on load and pushes theme changes back, so
 * light/dark choice follows the user across devices (alongside flavor and
 * reading prefs, which sync from their own providers/hooks).
 */
export function PreferenceSync() {
  const { theme, setTheme } = useTheme();
  const { getPref, savePref } = useSession();
  const hydrated = React.useRef(false);

  // On first mount, apply the server's theme if it differs.
  React.useEffect(() => {
    const serverTheme = getPref<string | null>("theme", null);
    if (serverTheme && serverTheme !== theme) setTheme(serverTheme);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After hydration, persist user-driven theme changes.
  React.useEffect(() => {
    if (!hydrated.current || !theme) return;
    if (getPref<string | null>("theme", null) === theme) return;
    savePref("theme", theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return null;
}
