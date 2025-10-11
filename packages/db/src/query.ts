import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from ".";
import { server, serverStatus, serverVote } from "./schema";
import { intWithFallback, sumAsIntWithFallback } from "./util";
import { int } from "drizzle-orm/mysql-core";

export const getAllServers = async () =>
  await db
    .select({
      id: server.id,
      name: server.name,
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
    })
    .from(server)
    .leftJoin(serverStatus, eq(server.id, serverStatus.serverId))
    .leftJoin(serverVote, eq(server.id, serverVote.serverId))
    .groupBy(server.id)
    .orderBy(asc(server.id), desc(serverStatus.timestamp));
