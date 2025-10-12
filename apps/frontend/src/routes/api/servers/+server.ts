import { getAllServers } from '@osu-server-list/db/query';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const GET = async (req: RequestEvent) => {
	const sort = req.url.searchParams.get('sort') ?? 'onlinePlayers';

	let servers = await getAllServers();

	if (sort === 'onlinePlayers') {
		servers = servers.sort((a, b) => {
			if (a.onlinePlayers === -1) return 1;
			if (b.onlinePlayers === -1) return -1;
			return b.onlinePlayers - a.onlinePlayers;
		});
	} else if (sort === 'registeredPlayers') {
		servers = servers.sort((a, b) => {
			if (a.registeredPlayers === -1) return 1;
			if (b.registeredPlayers === -1) return -1;
			return b.registeredPlayers - a.registeredPlayers;
		});
	} else if (sort === 'name') {
		servers = servers.sort((a, b) => a.name.localeCompare(b.name));
	} else if (sort === 'votes') {
		servers = servers.sort((a, b) => b.votes - a.votes);
	} else {
		return error(
			400,
			'Invalid sort parameter, available options are: onlinePlayers, registeredPlayers, name, votes'
		);
	}

	return json(servers);
};
