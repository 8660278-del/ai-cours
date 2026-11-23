import { z } from "zod";

export const securityTrainerSaveSchema = z.object({
  answers: z.record(
    z.string().trim().min(1).max(120),
    z.enum(["allowed", "conditional", "forbidden"])
  ),
});

export type SecurityTrainerSaveInput = z.infer<
  typeof securityTrainerSaveSchema
>;
