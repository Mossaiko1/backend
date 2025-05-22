import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define environment variables schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .default("3000"),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .default("5432"),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("1d"),

  // Cors
  CORS_ORIGIN: z.string().default("*"),
});

// Parse and validate environment variables
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.format());
  throw new Error("Invalid environment variables");
}

export const config = env.data;
