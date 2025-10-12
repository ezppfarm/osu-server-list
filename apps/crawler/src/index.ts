import { betterFetch } from "@better-fetch/fetch";
import { addServerStatus, getAllServers } from "@osu-server-list/db/query";
import Baker from "cronbake";
import type { BpyUsersResponse } from "./types";

const baker = Baker.create();

baker.add({
  name: "server-status-job",
  cron: "@every_minute",
  overrunProtection: true,
  callback: async () => {
    const servers = await getAllServers();

    for (const server of servers) {
      let onlinePlayers = -1;
      let registeredPlayers = -1;
      let ping = -1;

      let pingStart = Bun.nanoseconds();
      try {
        if (server.type === "BANCHOPY") {
          const serverApiUrl = server.url.replace("https://", "https://api.");
          const serverRequest = await betterFetch<BpyUsersResponse>(
            serverApiUrl + "/v1/get_player_count"
          );
          if (!serverRequest.error) {
            onlinePlayers = serverRequest.data.counts.online;
            registeredPlayers = serverRequest.data.counts.total;
          }
        }
      } catch (e) {
        console.log("Error fetching server status:");
        console.log(e);
      }

      if (onlinePlayers > -1 && registeredPlayers > -1)
        ping = Number(((Bun.nanoseconds() - pingStart) / 1000000).toFixed());

      await addServerStatus(server.id, onlinePlayers, registeredPlayers, ping);
    }
  },
});

baker.bakeAll();
console.log("CronJob started.");
process.on("SIGINT", () => {
  baker.destroyAll();
  console.log("CronJob stopped.");
});