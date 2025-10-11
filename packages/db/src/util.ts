import { SQL, sql } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";

export const sumAsIntWithFallback = (expr: MySqlColumn, fallback: number) =>
  sql<number>`COALESCE(CAST(SUM(${expr}) AS SIGNED), ${fallback})`;

export const intWithFallback = (expr: MySqlColumn, fallback: number) =>
  sql<number>`COALESCE(${expr}, ${fallback})`;
