import { mysqlTable, int, text } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: int().primaryKey().autoincrement().notNull(),
  name: text().notNull(),
  password: text().notNull(),
});

export const server = mysqlTable("server", {
  id: int().primaryKey().autoincrement().notNull(),
  name: text().notNull(),
  description: text(),
  url: text().notNull(),
  iconUrl: text().notNull(),
  tags: text(),
  trending: int().notNull(),
});
