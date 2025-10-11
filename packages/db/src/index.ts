import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_HOST) throw new Error("DATABASE_HOST is not set");
if (!process.env.DATABASE_PORT) throw new Error("DATABASE_PORT is not set");
if (!process.env.DATABASE_USER) throw new Error("DATABASE_USER is not set");
if (!process.env.DATABASE_PASS) throw new Error("DATABASE_PASS is not set");
if (!process.env.DATABASE_DB) throw new Error("DATABASE_DB is not set");

const client = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_DB,
  maxIdle: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 3 * 1000, // 3 seconds
  idleTimeout: 5 * 60 * 1000, // 5 minutes
});

export const db = drizzle(client);
