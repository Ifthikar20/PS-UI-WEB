"use client";

import * as React from "react";
import { LogOut, Crown, Loader2 } from "lucide-react";
import { useSession } from "@/components/app/session-provider";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { me, refresh, logout } = useSession();
  const user = me?.user;
  const sub = me?.subscription;
  const [name, setName] = React.useState(user?.name ?? "");
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await api.patch("me/", { name });
      await refresh();
      setMsg("Saved");
    } catch (e) {
      setMsg(e instanceof ApiError ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Profile</h1>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback className="text-lg">
              {(user?.name || user?.email || "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-semibold">{user?.name || "Learner"}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </Button>
            {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" /> Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <Badge variant={sub?.isPremium ? "default" : "secondary"}>
              {sub?.isPremium ? "Premium" : "Free"}
            </Badge>
            {!sub?.isPremium && sub && (
              <p className="mt-2 text-sm text-muted-foreground">
                {sub.remainingFree} of {sub.usageLimit} free study sets left this
                month.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="text-destructive" onClick={() => logout()}>
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}
