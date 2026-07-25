import {
  pgTable,
  integer,
  text,
  bigint,
  serial,
  varchar,
  index,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

export const serverTypeEnum = pgEnum("server_type", [
  "BANCHOPY",
  "RIPPLE",
  "TITANIC",
  "SUNRISE",
  "CUSTOM",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "PENDING",
  "ACCEPTED",
  "DENIED",
]);

export const user = pgTable("user", {
  discordId: varchar({ length: 128 }).primaryKey().notNull(),
  systemAdmin: integer().notNull().default(0),
});

export const user_server_manage = pgTable("user_server_manage", {
  discordId: varchar({ length: 128 })
    .references(() => user.discordId)
    .notNull(),
  serverId: integer()
    .notNull()
    .references(() => server.id),
}, (table) => [
  primaryKey({ columns: [table.discordId, table.serverId] }),
  index("user_server_manage_server_idx").on(table.serverId),
]);

export const server = pgTable("server", {
  id: serial().primaryKey().notNull(),
  type: serverTypeEnum("type").default("BANCHOPY").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text(),
  url: text().notNull(),
  iconUrl: text().notNull(),
  discordUrl: text(),
  tags: text(),
  trending: integer().notNull(),
  date_added: bigint({ mode: "number" }).notNull(),
  location: text(),
}, (table) => [
  index("name_idx").on(table.name),
]);

export const serverStatus = pgTable("server_status", {
  id: serial().primaryKey().notNull(),
  serverId: integer()
    .references(() => server.id)
    .notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
  onlinePlayers: integer().notNull(),
  registeredPlayers: integer().notNull(),
  ping: integer().notNull(),
}, (table) => [
  index("server_status_server_timestamp_idx").on(table.serverId, table.timestamp),
]);

export const serverVote = pgTable("server_vote", {
  id: serial().primaryKey().notNull(),
  serverId: integer()
    .references(() => server.id)
    .notNull(),
  userId: integer().notNull(),
  ip: text().notNull(),
  browserFingerprint: bigint({ mode: "number" }).notNull(),
  timestamp: bigint({ mode: "number" }).notNull(),
}, (table) => [
  index("server_vote_server_timestamp_idx").on(table.serverId, table.timestamp),
  index("server_vote_ip_timestamp_idx").on(table.ip, table.timestamp),
  index("server_vote_user_server_timestamp_idx").on(
    table.userId,
    table.serverId,
    table.timestamp,
  ),
  index("server_vote_browser_timestamp_idx").on(
    table.browserFingerprint,
    table.timestamp,
  ),
]);

export const serverVoteHook = pgTable("server_vote_hook", {
  server_id: integer()
    .unique()
    .references(() => server.id)
    .notNull()
    .primaryKey(),
  postback_url: text(),
  discord_webhook_url: text(),
  // TODO: default content?
  discord_webhook_content: text(),
});

export const serverRequest = pgTable("server_request", {
  id: serial().primaryKey().notNull(),
  discordId: varchar({ length: 128 })
    .references(() => user.discordId)
    .notNull(),
  status: requestStatusEnum("status").default("PENDING").notNull(),
  type: serverTypeEnum("type").default("BANCHOPY").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text(),
  url: text().notNull(),
  iconUrl: text().notNull(),
  discordUrl: text(),
  tags: text(),
  location: text(),
  denialReason: text(),
  createdServerId: integer().references(() => server.id),
  submittedAt: bigint({ mode: "number" }).notNull(),
  reviewedAt: bigint({ mode: "number" }),
  seen: integer().notNull().default(0),
}, (table) => [
  index("request_discord_submitted_idx").on(table.discordId, table.submittedAt),
  index("request_status_submitted_idx").on(table.status, table.submittedAt),
  index("request_discord_seen_idx").on(table.discordId, table.seen),
  index("request_created_server_idx").on(table.createdServerId),
]);