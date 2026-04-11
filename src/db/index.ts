import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { relations } from "./relations.ts";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations,
  mode: "default",
  logger: true,
});
