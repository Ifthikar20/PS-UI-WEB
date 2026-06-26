import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue studying</CardDescription>
      </CardHeader>
      <CardContent>
        <React.Suspense fallback={null}>
          <AuthForm mode="login" />
        </React.Suspense>
      </CardContent>
    </Card>
  );
}
