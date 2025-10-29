import { mysqlTable, int, text, bigint } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: int().primaryKey().autoincrement().notNull(),
  name: text().notNull(),
  passwordHash: text().notNull(),
});

export const server = mysqlTable("server", {
  id: int().primaryKey().autoincrement().notNull(),
  type: text({ enum: ["BANCHOPY", "RIPPLE", "TITANIC", "CUSTOM"] })
    .default("BANCHOPY")
    .notNull(),
  name: text().notNull(),
  description: text(),
  url: text().notNull(),
  iconUrl: text().notNull(),
  tags: text(),
  trending: int().notNull(),
  date_added: bigint({ mode: "number" }).notNull(),
  location: text(),
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
  userId: int().notNull(),
  ip: text().notNull(),
  browserFingerprint: int().notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
});

export const serverVoteHook = mysqlTable("server_vote_hook", {
  server_id: int()
    .unique()
    .references(() => server.id)
    .notNull()
    .primaryKey(),
  postback_url: text(),
  discord_webhook_url: text(),
});
