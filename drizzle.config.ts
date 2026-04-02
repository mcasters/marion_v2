import * as dotenv from "dotenv";
import {resolve} from "path";
import {defineConfig} from 'drizzle-kit';

dotenv.config({ path: resolve(__dirname, ".env.local") });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
   url: process.env.DATABASE_URL!,
  },
});
