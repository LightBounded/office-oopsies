"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signUpAction } from "~/server/auth/sign-up";

export default function SignUp() {
  const [state, formAction] = useFormState(signUpAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form action={formAction} className="w-full max-w-96 px-4" noValidate>
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Office Oopsies
        </h1>
        <div className="mb-4 space-y-2">
          <div className="flex space-x-2">
            <div className="flex-grow">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                name="firstName"
                type="text"
                id="first-name"
                placeholder="First name"
              />
              {state?.fieldError?.firstName && (
                <p className="text-sm text-red-500">
                  {state.fieldError.firstName}
                </p>
              )}
            </div>
            <div className="flex-grow">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                name="lastName"
                type="text"
                id="last-name"
                placeholder="Last name"
              />
              {state?.fieldError?.lastName && (
                <p className="text-sm text-red-500">
                  {state.fieldError.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input name="email" type="email" id="email" placeholder="Email" />
            {state?.fieldError?.email && (
              <p className="text-sm text-red-500">{state.fieldError.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              name="username"
              type="text"
              id="username"
              placeholder="Username"
            />
            {state?.fieldError?.username && (
              <p className="text-sm text-red-500">
                {state.fieldError.username}
              </p>
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
          Sign Up
        </Button>
        <div className="text-center">
          <Link className="underline underline-offset-4" href="/sign-in">
            Have an account? Sign in
          </Link>
        </div>
      </form>
    </main>
  );
}
