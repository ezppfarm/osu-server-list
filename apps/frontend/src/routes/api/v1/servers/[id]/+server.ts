import { getServerById, getServerStatusThisYear, getServerUptime } from '@osu-server-list/db/query';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const { id } = params;
	try {
		const server = await getServerById(Number(id));
		if (!server) {
			return error(404, 'Server not found');
		}
		const uptime = await getServerUptime(Number(id), 1440);
		const heatmap = await getServerStatusThisYear(Number(id));
		return json({
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
			location: server.location,
			uptime: uptime.uptime,
			heatmap
		});
	} catch (e) {
		console.error(e);
		return error(500, 'Internal Server Error');
	}
};
