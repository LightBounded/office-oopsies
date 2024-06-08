"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { generateId, Scrypt } from "lucia";
import { z } from "zod";
import { lucia } from ".";
import { db } from "../db";
import { users } from "../db/schema";

const SignUpFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol.",
    ),
});

export async function signUpAction(_: unknown, formData: FormData) {
  const object = Object.fromEntries(formData.entries());
  const parsed = SignUpFormSchema.safeParse(object);

  if (!parsed.success) {
    const error = parsed.error.flatten();
    return {
      fieldError: {
        firstName: error.fieldErrors.firstName?.[0],
        lastName: error.fieldErrors.lastName?.[0],
        username: error.fieldErrors.username?.[0],
        password: error.fieldErrors.password?.[0],
        email: error.fieldErrors.email?.[0],
      },
    };
  }

  const { firstName, lastName, username, email, password } = parsed.data;

  const emailInUse = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  const usernameInUse = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
  });

  if (emailInUse) {
    return {
      fieldError: {
        email: "Email already in use",
      },
    };
  }

  if (usernameInUse) {
    return {
      fieldError: {
        username: "Username already in use",
      },
    };
  }

  const hashedPassword = await new Scrypt().hash(password);
  const userId = generateId(15);

  await db.insert(users).values({
    id: userId,
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}
