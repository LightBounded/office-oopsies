import { oopsieSchema } from "~/lib/validators";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { oopsies } from "~/server/db/schema";

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
    return ctx.db.query.oopsies.findFirst({
      orderBy: (oopsies, { desc }) => [desc(oopsies.timestamp)],
    });
  }),
});
