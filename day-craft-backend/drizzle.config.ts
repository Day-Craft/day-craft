import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./src/constants.ts";

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
} satisfies Config;
