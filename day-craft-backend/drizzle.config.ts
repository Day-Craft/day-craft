import type { Config } from "drizzle-kit";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
