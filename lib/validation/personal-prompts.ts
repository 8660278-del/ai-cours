import { z } from "zod";

export const createPersonalPromptSchema = z.object({
  title: z.string().trim().min(1).max(160),
  purpose: z.string().trim().min(1).max(1_000),
  category: z.string().trim().min(1).max(80),
  requiredInputs: z.array(z.string().trim().min(1).max(500)).min(1).max(20),
  variables: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  promptText: z.string().trim().min(1).max(8_000),
  constraints: z.array(z.string().trim().min(1).max(500)).max(20),
  outputRequirements: z.array(z.string().trim().min(1).max(500)).min(1).max(20),
  checks: z.array(z.string().trim().min(1).max(500)).min(1).max(20),
  source: z.enum(["lesson", "library"]).default("lesson"),
});

export type CreatePersonalPromptInput = z.infer<
  typeof createPersonalPromptSchema
>;
