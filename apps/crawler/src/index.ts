import { addServerStatus, getAllServers } from "@osu-server-list/db/query";
import Baker from "cronbake";
import { getApiHandler } from "./handlers/apihandlerhelper";
import type { UsersResponse } from "./types";

const baker = Baker.create();

baker.add({
  name: "server-status-job",
  cron: "@every_minute",
  start: true,
  overrunProtection: true,
  callback: async () => {
    const servers = await getAllServers();

    for (const server of servers) {
      console.log(`Fetching status for ${server.name}...`);

      let counts: UsersResponse = { onlineCount: -1, totalCount: -1 };
      let ping = -1;

      let pingStart = Bun.nanoseconds();
      try {
        const apiHandler = getApiHandler(server.url, server.type);
        counts = await apiHandler.fetchUserCounts();
      } catch (e) {
        console.log("Error fetching server status:");
        console.log(e);
      }

      if (counts.onlineCount > -1)
        ping = Number(((Bun.nanoseconds() - pingStart) / 1000000).toFixed());

      await addServerStatus(server.id, counts.onlineCount, counts.totalCount, ping);
      console.log(`Fetched status for ${server.name}: ${counts.onlineCount} online, ${counts.totalCount} total, ${ping}ms ping`);
    }
  },
});

baker.bakeAll();
console.log("CronJob started.");
process.on("SIGINT", () => {
  baker.destroyAll();
  console.log("CronJob stopped.");
});