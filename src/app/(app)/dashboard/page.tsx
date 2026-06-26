"use client";

import { useFlavor } from "@/components/app/flavor-provider";
import { FocusDashboard } from "@/components/dashboard/focus-dashboard";
import { PlayfulDashboard } from "@/components/dashboard/playful-dashboard";
import { ProDashboard } from "@/components/dashboard/pro-dashboard";

export default function DashboardPage() {
  const { flavor } = useFlavor();

  // Rose reuses the Focus layout — the pink palette comes from the flavor theme.
  switch (flavor) {
    case "playful":
      return <PlayfulDashboard />;
    case "pro":
      return <ProDashboard />;
    case "rose":
    case "focus":
    default:
      return <FocusDashboard />;
  }
}
