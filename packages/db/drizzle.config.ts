import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",

  dbCredentials: {
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT!),
    user: process.env.MYSQL_USERNAME!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!,
  },

  verbose: true,
  strict: true,
  dialect: "mysql",
});
