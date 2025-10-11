import { getAllServers } from '@osu-server-list/db/query';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const GET = async (req: RequestEvent) => {
	const sort = req.url.searchParams.get('sort') ?? 'onlinePlayers';

	let servers = await getAllServers();

	if (sort === 'onlinePlayers') {
		servers = servers.sort((a, b) => b.onlinePlayers - a.onlinePlayers);
	} else if (sort === 'registeredPlayers') {
		servers = servers.sort((a, b) => b.registeredPlayers - a.registeredPlayers);
	} else if (sort === 'trending') {
		servers = servers.sort((a, b) => b.trending - a.trending);
	} else if(sort === "votes") {
        servers = servers.sort((a, b) => b.votes - a.votes);
    }

	return json(servers);
};
