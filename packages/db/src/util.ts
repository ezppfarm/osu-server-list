import { SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

export const sumAsIntWithFallback = (expr: PgColumn, fallback: number) =>
  sql<number>`COALESCE(CAST(SUM(${expr}) AS INTEGER), ${fallback})`;

export const intWithFallback = (expr: PgColumn, fallback: number) =>
  sql<number>`COALESCE(${expr}, ${fallback})`;

export const stringWithFallback = (expr: PgColumn, fallback: string) =>
  sql<string>`COALESCE(${expr}, ${fallback})`;

export const countDistinctWithFallback = (
  expr: PgColumn,
  fallback: number,
) => sql<number>`COALESCE(COUNT(DISTINCT ${expr}), ${fallback})`;

export const encodePassword = (password: string) => {
  const sha1 = new Bun.SHA1();
  const md5 = new Bun.MD5();
  const encodedPassword = sha1.update(password).digest("hex");
  const hashedPassword = md5.update(encodedPassword).digest("hex");
  return hashedPassword;
};

export const comparePassword = (password: string, hashedPassword: string) => {
  const encodedPassword = encodePassword(password);
  return encodedPassword === hashedPassword;
};
