import { defineConfig } from "drizzle-kit";

const url = process.env.DB_URL ?? "http://localhost:8080";
const authToken = process.env.DB_AUTH_TOKEN ?? "secret";

export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  driver: "turso",
  dbCredentials: {
    url,
    authToken,
  },
});
