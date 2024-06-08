// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `office-oopsies_${name}`,
);

export const users = createTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull(),
    hashedPassword: text("hashed_password").notNull(),
  },
  (table) => ({
    username: index("username_idx").on(table.username),
    firstName: index("first_name_idx").on(table.firstName),
    lastName: index("last_name_idx").on(table.lastName),
  }),
);

export type SelectUser = typeof users.$inferSelect;

export const sessions = createTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: int("expires_at").notNull(),
});

export const oopsies = createTable("oopsy", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
  description: text("description").notNull(),
  longitude: text("longitude"),
  latitude: text("latitude"),
  imageUrl: text("image_url"),
  likes: int("likes").notNull().default(0),
});
