import { and, desc, eq, max } from "drizzle-orm";
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
    .groupBy(server.id, serverStatus.timestamp)
    .orderBy(desc(serverStatus.timestamp));
};

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
