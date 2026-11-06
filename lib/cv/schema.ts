import { z } from "zod";

const short = z.string().trim().max(200);
const url = z.string().trim().max(300);
const paragraph = z.string().trim().max(2000);
const lines = z
  .array(z.string().trim().max(600))
  .max(30)
  .transform((items) => items.filter(Boolean));

export const cvContentSchema = z.object({
  name: short.min(1),
  headline: short,
  location: short,
  contacts: z.array(z.object({ label: short, url })).max(8),
  summary: paragraph,
  experience: z
    .array(
      z.object({
        role: short,
        company: short,
        url,
        period: short,
        bullets: lines,
      }),
    )
    .max(15),
  projects: z
    .array(
      z.object({
        name: short,
        url,
        period: short,
        description: paragraph,
        bullets: lines,
      }),
    )
    .max(15),
  skills: z.array(z.object({ group: short, items: z.string().trim().max(600) })).max(12),
  education: z.array(z.object({ institution: short, degree: short, period: short })).max(8),
  languages: z.array(z.object({ name: short, level: short })).max(8),
});

export type CvContent = z.infer<typeof cvContentSchema>;
