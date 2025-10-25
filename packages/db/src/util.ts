import { SQL, sql } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";

export const sumAsIntWithFallback = (expr: MySqlColumn, fallback: number) =>
  sql<number>`COALESCE(CAST(SUM(${expr}) AS SIGNED), ${fallback})`;

export const intWithFallback = (expr: MySqlColumn, fallback: number) =>
  sql<number>`COALESCE(${expr}, ${fallback})`;

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
