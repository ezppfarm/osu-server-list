import { and, desc, eq, gt, max } from "drizzle-orm";
import { db } from ".";
import { server, serverStatus, serverVote } from "./schema";
import { intWithFallback, sumAsIntWithFallback } from "./util";


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
        "onlinePlayers"
      ),
      registeredPlayers: intWithFallback(serverStatus.registeredPlayers, -1).as(
        "registeredPlayers"
      ),
      votes: sumAsIntWithFallback(serverVote.id, 0).as("votes"),
      last_update: serverStatus.timestamp,
    })
    .from(server)
    .leftJoin(latestStatus, eq(server.id, latestStatus.serverId))
    .leftJoin(
      serverStatus,
      and(
        eq(serverStatus.serverId, latestStatus.serverId),
        eq(serverStatus.timestamp, latestStatus.latestTimestamp)
      )
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
      serverStatus.registeredPlayers
    )
    .orderBy(desc(serverStatus.timestamp));
};

export const getAllServersRaw = async () => {
  return await db.select().from(server);
}

export const addServerStatus = async (
  server: number,
  onlinePlayers: number,
  registeredPlayers: number,
  ping: number
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
  return (await db
    .select()
    .from(server)
    .where(eq(server.id, serverId))
    .limit(1))[0];
}

export const findRecentVoteByIp = async (serverId: number, ipAddress: string) => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return (await db
    .select()
    .from(serverVote)
    .where(
      and(
        eq(serverVote.serverId, serverId),
        eq(serverVote.ip, ipAddress),
        gt(serverVote.timestamp, oneDayAgo)
      )
    )
    .limit(1))[0];
};

export const findRecentVoteByUserId = async (serverId: number, userId: number) => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return (await db
    .select()
    .from(serverVote)
    .where(
      and(
        eq(serverVote.serverId, serverId),
        eq(serverVote.userId, userId),
        gt(serverVote.timestamp, oneDayAgo)
      )
    )
    .limit(1))[0];
};

export const addServerVote = async (
  serverId: number,
  ipAddress: string,
  userId: number
) => {
  await db.insert(serverVote).values({
    serverId,
    ip: ipAddress,
    timestamp: Date.now(),
    userId
  });
};