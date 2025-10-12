import { mysqlTable, int, text, bigint } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: int().primaryKey().autoincrement().notNull(),
  name: text().notNull(),
  password: text().notNull(),
});

export const server = mysqlTable("server", {
  id: int().primaryKey().autoincrement().notNull(),
  type: text({ enum: ["BANCHOPY", "RIPPLE", "CUSTOM"] })
    .default("BANCHOPY")
    .notNull(),
  name: text().notNull(),
  description: text(),
  url: text().notNull(),
  iconUrl: text().notNull(),
  tags: text(),
  trending: int().notNull(),
});

export const serverStatus = mysqlTable("server_status", {
  id: int().primaryKey().autoincrement().notNull(),
  serverId: int()
    .references(() => server.id)
    .notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
  onlinePlayers: int().notNull(),
  registeredPlayers: int().notNull(),
  ping: int().notNull(),
});

export const serverVote = mysqlTable("server_vote", {
  id: int().primaryKey().autoincrement().notNull(),
  serverId: int()
    .references(() => server.id)
    .notNull(),
  username: text().notNull(),
  ip: text().notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
});
