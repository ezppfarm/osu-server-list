import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gt,
  gte,
  lte,
  max,
  sql,
} from "drizzle-orm";
import { db } from ".";
import {
  server,
  serverStatus,
  serverVote,
  serverVoteHook,
  user,
  user_server_manage as userServerManage,
} from "./schema";
import {
  comparePassword,
  countDistinctWithFallback,
  intWithFallback,
  sumAsIntWithFallback,
} from "./util";
import type { ServerManage } from "./types";

export const getAllServers = async () => {
  const latestStatus = db
    .select({
      serverId: serverStatus.serverId,
      latestTimestamp: max(serverStatus.timestamp).as("latestTimestamp"),
    })
    .from(serverStatus)
    .groupBy(serverStatus.serverId)
    .as("latestStatus");

  return await db
    .select({
      id: server.id,
      name: server.name,
      type: server.type,
      description: server.description,
      url: server.url,
      iconUrl: server.iconUrl,
      tags: server.tags,
      trending: server.trending,
      onlinePlayers: intWithFallback(serverStatus.onlinePlayers, -1).as(
        "onlinePlayers",
      ),
      registeredPlayers: intWithFallback(serverStatus.registeredPlayers, -1).as(
        "registeredPlayers",
      ),
      ping: intWithFallback(serverStatus.ping, -1).as("ping"),
      votes: countDistinctWithFallback(serverVote.id, 0).as("votes"),
      last_update: serverStatus.timestamp,
      date_added: server.date_added,
      location: server.location,
    })
    .from(server)
    .leftJoin(latestStatus, eq(server.id, latestStatus.serverId))
    .leftJoin(
      serverStatus,
      and(
        eq(serverStatus.serverId, latestStatus.serverId),
        eq(serverStatus.timestamp, latestStatus.latestTimestamp),
      ),
    )
    .leftJoin(serverVote, eq(server.id, serverVote.serverId))
    .groupBy(
      server.id,
      server.name,
      server.type,
      server.description,
      server.url,
      server.iconUrl,
      server.tags,
      server.trending,
      serverStatus.timestamp,
      serverStatus.onlinePlayers,
      serverStatus.registeredPlayers,
    )
    .orderBy(desc(serverStatus.timestamp));
};

export const getAllServersRaw = async () => {
  return await db.select().from(server);
};

export const getServerById = async (serverId: number) => {
  const latestStatus = db
    .select({
      serverId: serverStatus.serverId,
      latestTimestamp: max(serverStatus.timestamp).as("latestTimestamp"),
    })
    .from(serverStatus)
    .where(eq(serverStatus.serverId, serverId))
    .groupBy(serverStatus.serverId)
    .as("latestStatus");

  const result = await db
    .select({
      id: server.id,
      name: server.name,
      type: server.type,
      description: server.description,
      url: server.url,
      iconUrl: server.iconUrl,
      tags: server.tags,
      trending: server.trending,
      onlinePlayers: intWithFallback(serverStatus.onlinePlayers, -1).as(
        "onlinePlayers",
      ),
      registeredPlayers: intWithFallback(serverStatus.registeredPlayers, -1).as(
        "registeredPlayers",
      ),
      ping: intWithFallback(serverStatus.ping, -1).as("ping"),
      votes: sumAsIntWithFallback(serverVote.id, 0).as("votes"),
      last_update: serverStatus.timestamp,
      date_added: server.date_added,
      location: server.location,
    })
    .from(server)
    .where(eq(server.id, serverId))
    .leftJoin(latestStatus, eq(server.id, latestStatus.serverId))
    .leftJoin(
      serverStatus,
      and(
        eq(serverStatus.serverId, latestStatus.serverId),
        eq(serverStatus.timestamp, latestStatus.latestTimestamp),
      ),
    )
    .leftJoin(serverVote, eq(server.id, serverVote.serverId))
    .groupBy(
      server.id,
      server.name,
      server.type,
      server.description,
      server.url,
      server.iconUrl,
      server.tags,
      server.trending,
      serverStatus.timestamp,
      serverStatus.onlinePlayers,
      serverStatus.registeredPlayers,
    )
    .orderBy(desc(serverStatus.timestamp))
    .limit(1);

  return result[0] ?? null;
};

export const getServerStatusById = async (serverId: number, amount: number) => {
  return await db
    .select()
    .from(serverStatus)
    .where(eq(serverStatus.serverId, serverId))
    .orderBy(desc(serverStatus.timestamp))
    .limit(amount);
};

export const addServerStatus = async (
  server: number,
  onlinePlayers: number,
  registeredPlayers: number,
  ping: number,
) => {
  await db.insert(serverStatus).values({
    serverId: server,
    timestamp: Date.now(),
    onlinePlayers,
    registeredPlayers,
    ping,
  });
};

export const findServerById = async (serverId: number) => {
  return (
    await db.select().from(server).where(eq(server.id, serverId)).limit(1)
  )[0];
};

export const findRecentVoteByIp = async (ipAddress: string) => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return (
    await db
      .select()
      .from(serverVote)
      .where(
        and(eq(serverVote.ip, ipAddress), gt(serverVote.timestamp, oneDayAgo)),
      )
      .limit(1)
  )[0];
};

export const findRecentVoteByUserId = async (
  serverId: number,
  userId: number,
) => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return (
    await db
      .select()
      .from(serverVote)
      .where(
        and(
          eq(serverVote.serverId, serverId),
          eq(serverVote.userId, userId),
          gt(serverVote.timestamp, oneDayAgo),
        ),
      )
      .limit(1)
  )[0];
};

export const findRecentVoteByBrowserFingerprint = async (
  browserFingerprint: number,
) => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return (
    await db
      .select()
      .from(serverVote)
      .where(
        and(
          eq(serverVote.browserFingerprint, browserFingerprint),
          gt(serverVote.timestamp, oneDayAgo),
        ),
      )
      .limit(1)
  )[0];
};

export const addServerVote = async (
  serverId: number,
  ipAddress: string,
  userId: number,
  browserFingerprint: number,
) => {
  await db.insert(serverVote).values({
    serverId,
    ip: ipAddress,
    timestamp: Date.now(),
    userId,
    browserFingerprint,
  });
};

export const getServerUptime = async (
  serverId: number,
  durationMinutes = 1440,
) => {
  const now = Date.now();
  const startTime = now - durationMinutes * 60 * 1000;

  const resultValidPings = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(serverStatus)
    .where(
      and(
        eq(serverStatus.serverId, serverId),
        gte(serverStatus.timestamp, startTime),
        lte(serverStatus.timestamp, now),
        gt(serverStatus.ping, -1),
      ),
    );

  const resultAllPings = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(serverStatus)
    .where(
      and(
        eq(serverStatus.serverId, serverId),
        gte(serverStatus.timestamp, startTime),
        lte(serverStatus.timestamp, now),
      ),
    );

  const countSuccess = resultValidPings[0]?.count ?? 0;
  const countAll = resultAllPings[0]?.count ?? 0;
  const expected = countAll < durationMinutes ? countAll : durationMinutes;
  const uptime = Math.min((countSuccess / expected) * 100, 100);

  return {
    serverId,
    uptime: Number(uptime.toFixed(2)),
    successfulPings: countSuccess,
    expectedPings: expected,
    startTime,
    endTime: now,
  };
};

export const getServerStatusThisYear = async (serverId: number) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  const startUnixMs = startOfYear.getTime();
  const endUnixMs = endOfYear.getTime();

  const dayExpr = sql<string>`DATE(FROM_UNIXTIME(${serverStatus.timestamp} / 1000))`;

  const result = await db
    .select({
      day: dayExpr,
      onlinePlayers: sql<number>`MAX(${serverStatus.onlinePlayers})`,
      registeredPlayers: sql<number>`MAX(${serverStatus.registeredPlayers})`,
      votes: countDistinct(serverVote.id),
      avgPing: sql<number>`ROUND(AVG(${serverStatus.ping}))`,
    })
    .from(serverStatus)
    .where(
      and(
        eq(serverStatus.serverId, serverId),
        gte(serverStatus.timestamp, startUnixMs),
        lte(serverStatus.timestamp, endUnixMs),
      ),
    )
    .leftJoin(
      serverVote,
      and(
        eq(serverVote.serverId, serverStatus.serverId),
        sql`DATE(FROM_UNIXTIME(${serverVote.timestamp} / 1000)) = ${dayExpr}`,
      ),
    )
    .groupBy(dayExpr)
    .orderBy(sql`DATE(FROM_UNIXTIME(${serverStatus.timestamp} / 1000)) ASC`);

  return result;
};

export const getUserTotalVotesForServer = async (
  userId: number,
  serverId: number,
) => {
  const userVotes = await db
    .select()
    .from(serverVote)
    .where(
      and(eq(serverVote.userId, userId), eq(serverVote.serverId, serverId)),
    );
  return userVotes.length;
};

export const getUserLastVoteForServer = async (
  userId: number,
  serverId: number,
) => {
  const lastUserVote = await db
    .select()
    .from(serverVote)
    .where(
      and(eq(serverVote.userId, userId), eq(serverVote.serverId, serverId)),
    )
    .orderBy(desc(serverVote.timestamp))
    .limit(1);
  return lastUserVote[0]?.timestamp ?? 0;
};

export const getServerHookData = async (serverId: number) => {
  const currentServer = await db
    .select()
    .from(serverVoteHook)
    .where(eq(serverVoteHook.server_id, serverId))
    .limit(1);
  return currentServer[0] ?? null;
};

export const addUser = async (discordId: string) => {
  try {
    await db.insert(user).values({
      discordId,
      systemAdmin: 0,
    });
  } catch {}
};

export const getUserManagePermissions = async (
  discordId: string,
): Promise<ServerManage | null> => {
  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.discordId, discordId))
    .limit(1);
  const selectedUser = currentUser[0];
  if (!selectedUser) {
    return null;
  }

  const serversToManage = await db
    .select({
      id: server.id,
      name: server.name,
      description: server.description,
      url: server.url,
      iconUrl: server.iconUrl,
      tags: server.tags,
      trending: server.trending,
    })
    .from(userServerManage)
    .innerJoin(server, eq(server.id, userServerManage.serverId))
    .where(eq(userServerManage.discordId, selectedUser.discordId));

  return {
    systemAdmin: selectedUser.systemAdmin === 1,
    manageServers: serversToManage ?? [],
  };
};

export const deleteServer = async (serverId: number) => {
  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(serverVoteHook)
        .where(eq(serverVoteHook.server_id, serverId));
      await tx.delete(serverVote).where(eq(serverVote.serverId, serverId));
      await tx.delete(serverStatus).where(eq(serverStatus.serverId, serverId));
      await tx
        .delete(userServerManage)
        .where(eq(userServerManage.serverId, serverId));
      await tx.delete(server).where(eq(server.id, serverId));
    });
    return true;
  } catch {
    return false;
  }
};

export const addServer = async (
  name: string,
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "CUSTOM",
  description: string,
  iconUrl: string,
  tags: string,
  trending: boolean,
  url: string,
  location: string,
) => {
  try {
    await db.insert(server).values({
      name,
      type,
      description,
      iconUrl,
      tags,
      trending: trending ? 1 : 0,
      date_added: Date.now(),
      url,
      location,
    });
    return true;
  } catch {
    return false;
  }
};

export const editServer = async (
  serverId: number,
  opts: {
    name: string;
    type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "CUSTOM";
    description: string;
    iconUrl: string;
    tags: string;
    trending: boolean;
    url: string;
    location: string;
  },
) => {
  try {
    await db
      .update(server)
      .set({
        name: opts.name,
        type: opts.type,
        description: opts.description,
        iconUrl: opts.iconUrl,
        tags: opts.tags,
        trending: opts.trending ? 1 : 0,
        url: opts.url,
        location: opts.url,
      })
      .where(eq(server.id, serverId));
    return true;
  } catch {
    return false;
  }
};
