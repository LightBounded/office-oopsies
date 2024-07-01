import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { oopsieSchema } from "~/lib/validators";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { oopsieLikes, oopsies, users } from "~/server/db/schema";

export const oopsieRouter = createTRPCRouter({
  create: protectedProcedure
    .input(oopsieSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(oopsies).values({
          authorId: ctx.user.id,
          description: input.description,
          userId: input.userId,
          latitude: input.latitude,
          longitude: input.longitude,
          imageUrl: input.imageUrl,
        });
        // Update number of oopsies on a user's profile
        await tx
          .update(users)
          .set({
            oopsiesCount: sql`${users.oopsiesCount} + 1`,
          })
          .where(eq(users.id, input.userId));
      });
    }),
  getLatest: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().min(1).max(50).default(5),
      }),
    )
    .query(async ({ ctx, input }) => {
      const oopsies = await ctx.db.query.oopsies.findMany({
        orderBy: (oopsies, { desc }) => [desc(oopsies.timestamp)],
        limit: input.limit,
        offset: input.cursor ? input.cursor * input.cursor : 0,
        with: {
          user: true,
          author: true,
        },
      });

      let nextCursor: typeof input.cursor;
      if (oopsies.length === input.limit) {
        nextCursor = input.cursor ? input.cursor + 1 : 1;
      }

      return {
        oopsies,
        nextCursor,
      };
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
