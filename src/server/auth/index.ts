import { Lucia, TimeSpan } from "lucia";

import type { SelectUser } from "../db/schema";
import { adapter } from "../db";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      username: attributes.username,
    };
  },
  sessionExpiresIn: new TimeSpan(1, "w"),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<SelectUser, "hashedPassword">;
  }
}

export * from "lucia";
