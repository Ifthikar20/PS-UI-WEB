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

/**
 * "How ready are you" — average answer accuracy across finished days, as a
 * percentage. null when nothing has been answered yet.
 */
export function readiness(plan: ExamPlan): number | null {
  const rows = Object.values(plan.results ?? {}).filter((r) => r.total > 0);
  if (rows.length === 0) return null;
  const got = rows.reduce((s, r) => s + r.correct, 0);
  const total = rows.reduce((s, r) => s + r.total, 0);
  return total ? Math.round((100 * got) / total) : null;
}

export type Urgency = "past" | "today" | "soon" | "close" | "calm";

/** Bucket the days-left countdown so the UI can color-code urgency. */
export function urgency(daysLeft: number): Urgency {
  if (daysLeft < 0) return "past";
  if (daysLeft === 0) return "today";
  if (daysLeft <= 3) return "soon";
  if (daysLeft <= 7) return "close";
  return "calm";
}

/** Short, plain-language phrase for a readiness percentage. */
export function readinessLabel(pct: number | null): string {
  if (pct === null) return "Not started yet";
  if (pct >= 85) return "Exam-ready";
  if (pct >= 70) return "On track";
  if (pct >= 50) return "Getting there";
  return "Needs more practice";
}

export const STATUS_LABEL: Record<ExamPlan["status"], string> = {
  draft: "Draft",
  generating: "Generating",
  proposed: "Needs approval",
  active: "Active",
  completed: "Completed",
};
