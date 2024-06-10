import { z } from "zod";

export const oopsieSchema = z.object({
  description: z.string().min(1, "Description is required"),
  userId: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  imageUrl: z.string(),
});

export type Oopsie = z.infer<typeof oopsieSchema>;

export const oopsieFormSchema = oopsieSchema.omit({
  imageUrl: true,
});

export type OopsieForm = z.infer<typeof oopsieSchema>;
