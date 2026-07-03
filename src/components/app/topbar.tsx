"use client";

import Link from "next/link";
import { LogOut, User as UserIcon, Settings, Flame, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "./session-provider";
import { TimerPill } from "./timer-pill";
import { WarmthControl } from "./warmth-control";

function initials(name?: string | null, email?: string) {
  const src = name?.trim() || email || "?";
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export function Topbar() {
  const { me, logout } = useSession();
  const user = me?.user;
  const rewards = me?.rewards;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="lg:hidden">
        {/* Logo space is handled by sidebar on desktop; keep left clear on mobile */}
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {rewards && (
          <div className="hidden items-center gap-3 sm:flex">
            <Badge variant="secondary" className="gap-1 font-semibold">
              <Star className="h-3.5 w-3.5" /> {rewards.points.toLocaleString()}
            </Badge>
            <Badge variant="secondary" className="gap-1 font-semibold">
              <Flame className="h-3.5 w-3.5" /> {rewards.streak}
            </Badge>
          </div>
        )}
        <TimerPill />
        <ThemeToggle />
        <WarmthControl />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar>
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                <AvatarFallback>
                  {initials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span>{user?.name || "Learner"}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-destructive">
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
