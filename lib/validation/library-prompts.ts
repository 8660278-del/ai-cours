import { z } from "zod";
import { promptCategories } from "@/lib/prompt-library";

const categoryIds = promptCategories.map((category) => category.id);

export const createLibraryPromptSchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z
    .string()
    .trim()
    .refine((value) => categoryIds.includes(value), {
      message: "Выберите категорию из списка.",
    }),
  promptText: z.string().trim().min(1).max(8_000),
  purpose: z.string().trim().max(1_000).optional(),
  situation: z.string().trim().max(1_000).optional(),
  variables: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  exampleOutput: z.string().trim().max(2_000).optional(),
  checks: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
});

export type CreateLibraryPromptInput = z.infer<
  typeof createLibraryPromptSchema
>;

export const favoritePromptSchema = z.object({
  promptId: z.string().trim().min(1).max(160),
});

export type FavoritePromptInput = z.infer<typeof favoritePromptSchema>;
