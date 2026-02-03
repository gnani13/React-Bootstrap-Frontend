import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

let dbPath = process.env.DATABASE_URL || "donations.db";
if (dbPath.startsWith("file:")) {
  dbPath = dbPath.replace("file:", "").replace(/^\.*\//, "");
}
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
