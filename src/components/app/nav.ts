import {
  LayoutDashboard,
  Library,
  Gamepad2,
  CalendarCheck,
  LineChart,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Library", href: "/library", icon: Library },
  { label: "Games", href: "/games", icon: Gamepad2 },
  { label: "Exam Prep", href: "/exam", icon: CalendarCheck },
  { label: "Activity", href: "/activity", icon: LineChart },
  { label: "Supervise", href: "/supervise", icon: Users },
  { label: "Rewards", href: "/rewards", icon: Trophy },
];
