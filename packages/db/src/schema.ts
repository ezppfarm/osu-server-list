import {
  mysqlTable,
  int,
  text,
  bigint,
  tinyint,
  longtext,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  discordId: varchar({ length: 128 }).primaryKey().notNull(),
  systemAdmin: tinyint().notNull().default(0),
});

export const user_server_manage = mysqlTable("user_server_manage", {
  discordId: varchar({ length: 128 })
    .references(() => user.discordId)
    .notNull(),
  serverId: int()
    .notNull()
    .references(() => server.id),
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
  browserFingerprint: bigint({ mode: "number" }).notNull(),
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
  // TODO: default content?
  discord_webhook_content: text(),
});
