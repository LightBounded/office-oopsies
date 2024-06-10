"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signInAction } from "~/server/auth/sign-in";

export default function SignIn() {
  const [state, formAction] = useFormState(signInAction, null);

  useEffect(() => {
    if (state?.formError) {
      toast.error(state.formError, {
        richColors: true,
      });
    }
  }, [state]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form action={formAction} className="w-full max-w-96 px-4" noValidate>
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Office Oopsies
        </h1>
        <div className="mb-4 space-y-2">
          <div className="space-y-1">
            <Label htmlFor="text">Email or username</Label>
            <Input
              name="text"
              type="text"
              id="text"
              placeholder="Email or username"
            />
            {state?.fieldError?.text && (
              <p className="text-sm text-red-500">{state.fieldError.text}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              type="password"
              id="password"
              placeholder="Password"
            />
            {state?.fieldError?.password && (
              <p className="text-sm text-red-500">
                {state.fieldError.password}
              </p>
            )}
          </div>
        </div>
        <Button className="mb-2 w-full" type="submit">
          Sign In
        </Button>
        <div className="text-center">
          <Link className="underline underline-offset-4" href="/sign-up">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </form>
    </main>
  );
}
