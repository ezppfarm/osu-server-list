import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_HOST) throw new Error("DATABASE_HOST is not set");
if (!process.env.DATABASE_PORT) throw new Error("DATABASE_PORT is not set");
if (!process.env.DATABASE_USER) throw new Error("DATABASE_USER is not set");
if (!process.env.DATABASE_PASS) throw new Error("DATABASE_PASS is not set");
if (!process.env.DATABASE_DB) throw new Error("DATABASE_DB is not set");

export default defineConfig({
  schema: "./src/schema.ts",

  dbCredentials: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
  },

  verbose: true,
  strict: true,
  dialect: "mysql",
});
