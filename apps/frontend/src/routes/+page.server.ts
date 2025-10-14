import { getAllServers } from '@osu-server-list/db/query';

export async function load() {
	const servers = await getAllServers();

	return {
		servers: servers.sort((a, b) => b.onlinePlayers - a.onlinePlayers)
	};
}
