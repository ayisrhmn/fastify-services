import { z } from "zod";
import { config } from "dotenv";

config();

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.url().min(1),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
