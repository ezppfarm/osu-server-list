import {
  mysqlTable,
  int,
  text,
  bigint,
  tinyint,
  varchar,
  index,
  mysqlEnum,
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
  type: mysqlEnum("type", ["BANCHOPY", "RIPPLE", "TITANIC", "SUNRISE", "CUSTOM"])
    .default("BANCHOPY")
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text(),
  url: text().notNull(),
  iconUrl: text().notNull(),
  discordUrl: text(),
  tags: text(),
  trending: int().notNull(),
  date_added: bigint({ mode: "number" }).notNull(),
  location: text(),
}, (table) => [
  index("name_idx").on(table.name),
]);

export const serverStatus = mysqlTable("server_status", {
  id: int().primaryKey().autoincrement().notNull(),
  serverId: int()
    .references(() => server.id)
    .notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
  onlinePlayers: int().notNull(),
  registeredPlayers: int().notNull(),
  ping: int().notNull(),
}, (table) => [
  index("server_timestamp_idx").on(table.serverId, table.timestamp),
  index("online_players_idx").on(table.onlinePlayers),
]);

export const serverVote = mysqlTable("server_vote", {
  id: int().primaryKey().autoincrement().notNull(),
  serverId: int()
    .references(() => server.id)
    .notNull(),
  userId: int().notNull(),
  ip: text().notNull(),
  browserFingerprint: bigint({ mode: "number" }).notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
}, (table) => [
  index("server_idx").on(table.serverId),
]);

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
