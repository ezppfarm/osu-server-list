import { getAllServers } from '@osu-server-list/db/query';

export async function load() {
	const servers = await getAllServers();

	return {
		servers
	};
}
