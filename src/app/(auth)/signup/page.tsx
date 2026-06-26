import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Start turning notes into games</CardDescription>
      </CardHeader>
      <CardContent>
        <React.Suspense fallback={null}>
          <AuthForm mode="signup" />
        </React.Suspense>
      </CardContent>
    </Card>
  );
}
