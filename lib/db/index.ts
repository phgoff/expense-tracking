import * as schema from "@/lib/db/schema";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

const url = process.env.DB_URL ?? "http://localhost:8080";
const authToken = process.env.DB_AUTH_TOKEN ?? "secret";

const client = createClient({ url, authToken });

const db = drizzle(client, {
  schema,
});

export const adatper = new DrizzleSQLiteAdapter(
  db,
  schema.session,
  schema.users,
);

export default db;
