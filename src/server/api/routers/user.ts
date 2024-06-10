import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(users);
  }),
});
