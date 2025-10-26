import { getAllServers } from '@osu-server-list/db/query';
import { error, json } from '@sveltejs/kit';
import type { RequestEvent } from '../../../$types';

export const GET = async (req: RequestEvent) => {
	const sort = req.url.searchParams.get('sort') ?? 'onlinePlayers';

	let servers = await getAllServers();

	if (sort === 'onlinePlayers') {
		servers = servers.sort((a, b) => {
			if (a.onlinePlayers === -1) return 1;
			if (b.onlinePlayers === -1) return -1;
			return b.onlinePlayers - a.onlinePlayers;
		});
	} else if (sort === 'name') {
		servers = servers.sort((a, b) => a.name.localeCompare(b.name));
	} else if (sort === 'votes') {
		servers = servers.sort((a, b) => b.votes - a.votes);
	} else {
		return error(400, 'Invalid sort parameter, available options are: onlinePlayers, name, votes');
	}

	const remappedServers = servers.map((server) => {
		return {
			id: server.id,
			name: server.name,
			type: server.type,
			description: server.description,
			url: server.url,
			iconUrl: server.iconUrl,
			tags: server.tags?.split(','),
			trending: server.trending,
			onlinePlayers: server.onlinePlayers,
			registeredPlayers: server.registeredPlayers,
			ping: server.ping,
			votes: server.votes,
			last_update: server.last_update,
			date_added: server.date_added,
			location: server.location
		};
	});

	return json(remappedServers);
};
