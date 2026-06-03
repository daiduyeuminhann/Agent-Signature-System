import { z } from "zod";

export const plannerSchema = z.object({
  target: z.array(z.string()),

  frontend: z.object({
    framework: z.string().nullable()
  }),

  backend: z.object({
    language: z.string().nullable(),
    framework: z.string().nullable()
  }),

  database: z.string().nullable(),

  devops: z.array(z.string()),

  complexity: z.enum([
    "low",
    "medium",
    "high"
  ])
});