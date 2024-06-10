import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { oopsieSchema } from "~/lib/validators";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { oopsieLikes, oopsies } from "~/server/db/schema";

export const oopsieRouter = createTRPCRouter({
  create: protectedProcedure
    .input(oopsieSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(oopsies).values({
        authorId: input.userId,
        description: input.description,
        userId: input.userId,
        latitude: input.latitude,
        longitude: input.longitude,
        imageUrl: input.imageUrl,
      });
    }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.oopsies.findMany({
      orderBy: (oopsies, { desc }) => [desc(oopsies.timestamp)],
      with: {
        user: true,
        author: true,
      },
    });
  }),

  like: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // Check if user has already liked the oopsie
      const hasLiked = await ctx.db.query.oopsieLikes.findFirst({
        where: and(
          eq(oopsieLikes.oopsieId, input),
          eq(oopsieLikes.userId, ctx.session.userId),
        ),
      });

      if (hasLiked) {
        await ctx.db
          .delete(oopsieLikes)
          .where(
            and(
              eq(oopsieLikes.oopsieId, input),
              eq(oopsieLikes.userId, ctx.session.userId),
            ),
          );

        await ctx.db
          .update(oopsies)
          .set({
            likes: sql`${oopsies.likes} - 1`,
          })
          .where(eq(oopsies.id, input));
      } else {
        await ctx.db.insert(oopsieLikes).values({
          userId: ctx.session.userId,
          oopsieId: input,
        });

        await ctx.db
          .update(oopsies)
          .set({
            likes: sql`${oopsies.likes} + 1`,
          })
          .where(eq(oopsies.id, input));
      }
    }),
});
