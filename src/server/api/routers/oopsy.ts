import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { oopsies } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        description: z.string().min(1),
        userId: z.string(),
        latitude: z.string(),
        longitude: z.string(),
        imageUrl: z.string(),
      }),
    )
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
    return ctx.db.query.oopsies.findFirst({
      orderBy: (oopsies, { desc }) => [desc(oopsies.timestamp)],
    });
  }),
});
