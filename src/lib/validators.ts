import { z } from "zod";

export const createOopsieSchema = z.object({
  description: z.string().min(1, "Description is required"),
  userId: z.string().min(1, "User is required"),
  latitude: z.string(),
  longitude: z.string(),
  imageUrl: z.string().optional(),
});

export type CreateOopsie = z.infer<typeof createOopsieSchema>;

export const updateOopsieSchema = createOopsieSchema.partial().extend({
  oopsieId: z.number(),
});

export type UpdateOopsie = z.infer<typeof updateOopsieSchema>;
