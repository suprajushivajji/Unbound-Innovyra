import { z } from "zod";
import { DOMAINS } from "@/lib/domain";

export const ExecutionInputSchema = z.object({
  careerGoal: z.string().min(3).max(200),
  preferredDomain: z.string().min(2).max(100),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  timelineMonths: z.number().int().min(1).max(24).default(3),
  weeklyHours: z.number().int().min(1).max(60).default(10),
  replaceExisting: z.boolean().default(true),
});

export const DomainEnumSchema = z.enum(DOMAINS);
