import { getServerById, getServerStatusThisYear, getServerUptime } from '@osu-server-list/db/query';

export const load = async ({ params }) => {
	const { id } = params;
	try {
		const server = await getServerById(Number(id));
		if (!server) {
			return {
				status: 404,
				error: 'Server not found'
			};
		}
		const uptime = await getServerUptime(Number(id), 1440);
		const heatmap = await getServerStatusThisYear(Number(id));
		return {
			server: {
				id: server.id,
				name: server.name,
				type: server.type,
				description: server.description,
				url: server.url,
				iconUrl: server.iconUrl,
				tags: server.tags,
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
			}
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500,
			error: 'Internal Server Error'
		};
	}
};
