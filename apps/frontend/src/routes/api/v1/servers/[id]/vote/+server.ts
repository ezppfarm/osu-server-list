import { 
  addServerVote, 
  findRecentVoteByIp, 
  findRecentVoteByUserId, 
  findServerById 
} from "@osu-server-list/db/query";
import { getApiHandler } from "@osu-server-list/handlers";
import { error, type RequestEvent } from "@sveltejs/kit";


export const POST = async (req: RequestEvent) => {
  const serverId = parseInt(req.params.id!, 10);
  const userName = req.url.searchParams.get('name');
  const userIp = req.getClientAddress();

  if (!userName) {
    return error(400, 'Missing name parameter');
  }

  const server = await findServerById(serverId);
  if (!server) {
    return error(404, 'Server not found');
  }

  const recentIpVote = await findRecentVoteByIp(serverId, userIp);

  if (recentIpVote) {
    return error(429, 'You have already voted for this server in the last 24 hours');
  }

  const apiHandler = getApiHandler(server.url, server.type);
  const userInfo = await apiHandler.fetchUserInfo(userName);

  if (!userInfo) {
    return error(404, 'User not found on the specified server');
  }

  const recentIdVote = await findRecentVoteByUserId(serverId, userInfo.id);

  if (recentIdVote) {
    return error(429, 'You have already voted for this server in the last 24 hours');
  }

  await addServerVote(serverId, userIp, userInfo.id);

  return new Response(null, { status: 204 });
}