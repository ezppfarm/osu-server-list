import { env } from '$env/dynamic/public';
import { getClientIP } from '@/ip.js';
import { getServerById, getServerStatusThisYear, getServerUptime } from '@osu-server-list/db/query';
import { definePageMetaTags } from 'svelte-meta-tags';

export const ssr = true;

export const load = async ({ params, request, getClientAddress, url }) => {
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

		const metaTags = definePageMetaTags({
			title: `${server.name} - ${env.PUBLIC_APP_NAME}`,
			description:
				server.description ??
				'Browse, compare, and join thriving osu! private servers. Find communities with custom features, unique gameplay modes, and active player bases.',
			twitter: {
				title: `${server.name} - ${env.PUBLIC_APP_NAME}`,
				description:
					server.description ??
					'Browse, compare, and join thriving osu! private servers. Find communities with custom features, unique gameplay modes, and active player bases.'
			},
			openGraph: {
				title: `${server.name} - ${env.PUBLIC_APP_NAME}`,
				description:
					server.description ??
					'Browse, compare, and join thriving osu! private servers. Find communities with custom features, unique gameplay modes, and active player bases.',

				images: [
					{
						url: `${url.protocol}//${url.host}/server/${server.id}/logo?.png`
					}
				]
			}
		});
		return {
			openVoteDialog: url.searchParams.has('vote'),
			voteUser: url.searchParams.has('vote') ? url.searchParams.get('vote') : '',
			userIP: getClientIP(request, getClientAddress()),
			server: {
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
			},
			pageMetaTags: metaTags.pageMetaTags
		};
	} catch (e) {
		console.error(e);
		return {
			status: 500,
			error: 'Internal Server Error'
		};
	}
};
