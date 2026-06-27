import type { ExamPlan } from "./types";

/** Local YYYY-MM-DD for "today" (matches how the user perceives the date). */
export function todayYmd(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function daysUntil(dateStr: string): number {
  const exam = new Date(dateStr + "T00:00:00").getTime();
  const now = new Date(todayYmd() + "T00:00:00").getTime();
  return Math.round((exam - now) / 86400000);
}

export function completedDays(plan: ExamPlan): number {
  return (
    plan.progress?.completedDays ??
    Object.values(plan.results ?? {}).filter((r) => r.completed).length
  );
}

export const STATUS_LABEL: Record<ExamPlan["status"], string> = {
  draft: "Draft",
  generating: "Generating",
  proposed: "Needs approval",
  active: "Active",
  completed: "Completed",
};
