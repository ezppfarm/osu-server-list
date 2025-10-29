import { betterFetch } from "@better-fetch/fetch";
import {
  getServerHookData,
  getUserLastVoteForServer,
  getUserTotalVotesForServer,
} from "@osu-server-list/db/query";
import z from "zod";
import type { ServerPOSTBackData } from "./types";

const urlValidation = z.url().startsWith("https://");

export const sendPOSTBackVoteDataToServer = async (
  serverId: number,
  userId: number,
): Promise<boolean> => {
  const serverHookData = await getServerHookData(serverId);
  if (
    !serverHookData ||
    !serverHookData.postback_url ||
    serverHookData.postback_url.trim().length <= 0
  )
    return true;

  if (!urlValidation.safeParse(serverHookData.postback_url).success) {
    console.log(`Server ${serverId} has a invalid valid postback_url!`);
    return true;
  }

  const lastUserVote = await getUserLastVoteForServer(userId, serverId);
  const totalUserVotes = await getUserTotalVotesForServer(userId, serverId);

  try {
    const result = await betterFetch(serverHookData.postback_url, {
      method: "POST",
      body: JSON.stringify({
        currentVoteTimestamp: Date.now(),
        previousVoteTimestamp: lastUserVote,
        totalVotes: totalUserVotes,
        userId: userId,
      } satisfies ServerPOSTBackData),
      headers: {
        "Content-Type": "application/json",
      },
      throw: false,
    });

    if (result.error) {
      console.log(`Failed to send POSTBack vote date to server ${serverId}!`);
      return false;
    }
  } catch {
    console.log(`Failed to send POSTBack vote date to server ${serverId}!`);
    return false;
  }
  return true;
};
