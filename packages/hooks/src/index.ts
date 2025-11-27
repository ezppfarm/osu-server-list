import { betterFetch } from "@better-fetch/fetch";
import {
  getServerHookData,
  getUserLastVoteForServer,
  getUserTotalVotesForServer,
} from "@osu-server-list/db/query";
import type { ServerFull } from "@osu-server-list/db/types";
import z from "zod";
import type { ServerPOSTBackData } from "./types";
import { Embed, Webhook } from "@vermaysha/discord-webhook";

const postBackUrlValidation = z.url().startsWith("https://");
const discordWebhookUrlSchema = z
  .url()
  .regex(
    /^https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/,
  );

export const sendVoteDataToServer = async (
  server: ServerFull,
  userId: number,
  userName: string,
): Promise<boolean> => {
  const serverHookData = await getServerHookData(server.id);

  if (!serverHookData) return true;

  const postbackUrlPresent =
    typeof serverHookData.postback_url === "string" &&
    serverHookData.postback_url.trim().length > 0;

  const discordWebhookPresent =
    typeof serverHookData.discord_webhook_url === "string" &&
    serverHookData.discord_webhook_url.trim().length > 0;

  if (!postbackUrlPresent && !discordWebhookPresent) return true;

  const lastUserVote = await getUserLastVoteForServer(userId, server.id);
  const totalUserVotes = await getUserTotalVotesForServer(userId, server.id);

  if (postbackUrlPresent) {
    const postBackResult = await sendPOSTBackVoteDataToServer(
      server.id,
      serverHookData.postback_url!,
      userId,
      lastUserVote,
      totalUserVotes,
    );
    if (!postBackResult) {
      return false;
    }
  }

  if (discordWebhookPresent) {
    await sendDiscordVoteWebhook(
      serverHookData.discord_webhook_url!,
      serverHookData.discord_webhook_content!,
      server,
      userId,
      userName,
      totalUserVotes,
    );
  }

  return true;
};

const sendDiscordVoteWebhook = async (
  webhookUrl: string,
  webhookContent: string,
  server: ServerFull,
  userId: number,
  userName: string,
  totalVotes: number,
): Promise<boolean> => {
  if (!discordWebhookUrlSchema.safeParse(webhookUrl).success) {
    console.log(`Server ${server.id} has a invalid webhookUrl!`);
    return true;
  }

  const client = new Webhook(webhookUrl);

  const content = webhookContent
    .replace("{{ user_id }}", userId.toString())
    .replace("{{ user_name }}", userName)
    .replace("{{ total_votes }}", totalVotes.toString())
    .replace("{{ server_name }}", server.name)
    .replace("{{ server_url }}", server.url)
    // vote is added after data is sent
    .replace("{{ server_votes }}", (server.votes + 1).toString());

  const embed = new Embed()
    .setTitle(`Vote for ${server.name}`)
    .setDescription(content)
    .setColor(0x1e2939)
    .setTimestamp()
    .setFooter({ text: `powered by ${process.env.PUBLIC_APP_NAME}` });

  client.addEmbed(embed);

  try {
    await client.send();
  } catch {
    console.log(`Failed to send Discord vote webhook for server ${server.id}!`);
    return false;
  }

  return true;
};

const sendPOSTBackVoteDataToServer = async (
  serverId: number,
  postbackUrl: string,
  userId: number,
  previousVoteTimestamp: number,
  totalVotes: number,
): Promise<boolean> => {
  if (!postBackUrlValidation.safeParse(postbackUrl).success) {
    console.log(`Server ${serverId} has a invalid postbackUrl!`);
    return true;
  }

  try {
    const result = await betterFetch(postbackUrl, {
      method: "POST",
      body: JSON.stringify({
        currentVoteTimestamp: Date.now(),
        previousVoteTimestamp: previousVoteTimestamp,
        totalVotes: totalVotes,
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
