"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Scrypt } from "lucia";
import { z } from "zod";
import { lucia } from ".";
import { db } from "../db";

const SignInSchema = z.object({
  text: z.string().min(1, "Please enter a username or email"),
  password: z.string().min(1, "Please enter a password"),
});

export async function signInAction(_: unknown, formData: FormData) {
  const object = Object.fromEntries(formData.entries());
  const parsed = SignInSchema.safeParse(object);

  if (!parsed.success) {
    const error = parsed.error.flatten();
    return {
      fieldError: {
        text: error.fieldErrors.text?.[0],
        password: error.fieldErrors.password?.[0],
      },
    };
  }

  const { text, password } = parsed.data;

  const user = await db.query.users.findFirst({
    where: (table, { eq, or }) =>
      or(eq(table.email, text), eq(table.username, text)),
  });

  if (!user) {
    return {
      formError: "Invalid credentials",
    };
  }

  const validPassword = await new Scrypt().verify(
    user.hashedPassword,
    password,
  );

  if (!validPassword) {
    return {
      formError: "Invalid credentials",
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
