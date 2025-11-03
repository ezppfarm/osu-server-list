import { query } from '$app/server';
import { addServer, deleteServer, editServer, getAllServers } from '@osu-server-list/db/query';
import * as v from 'valibot';

export const removeServer = query(v.number(), async (serverId) => {
	const deleteResult = await deleteServer(serverId);
	if (deleteResult) {
		const allServers = await getAllServers();
		return {
			code: 200,
			message: 'Server deleted!',
			servers: allServers
		};
	}
	return {
		code: 400,
		message: 'Failed to delete server.',
		servers: []
	};
});

export const createServer = query(
	v.object({
		name: v.string(),
		description: v.string(),
		iconUrl: v.string(),
		tags: v.string(),
		trending: v.boolean(),
		url: v.string(),
		location: v.string()
	}),
	async (server) => {
		const allServers = await getAllServers();
		if (
			allServers.find((s) => s.url === server.url) ||
			allServers.find((s) => s.name === server.name)
		) {
			return {
				code: 400,
				message: 'Server already exists.',
				servers: allServers
			};
		}
		const addResult = await addServer(
			server.name,
			server.description,
			server.iconUrl,
			server.tags,
			server.trending,
			server.url,
			server.location
		);
		if (addResult) {
			const allServers = await getAllServers();
			return {
				code: 200,
				message: 'Server created!',
				servers: allServers
			};
		}
		return {
			code: 400,
			message: 'Failed to create server.',
			servers: []
		};
	}
);

export const updateServer = query(
	v.object({
		id: v.number(),
		name: v.string(),
		description: v.string(),
		iconUrl: v.string(),
		tags: v.string(),
		trending: v.boolean(),
		url: v.string(),
		location: v.string()
	}),
	async (server) => {
		const allServers = await getAllServers();
		if (
			allServers.find((s) => s.url === server.url) ||
			allServers.find((s) => s.name === server.name)
		) {
			return {
				code: 400,
				message: 'A Server with that name already exists.',
				servers: allServers
			};
		}
		const addResult = await editServer(server.id, {
			name: server.name,
			description: server.description,
			iconUrl: server.iconUrl,
			tags: server.tags,
			trending: server.trending,
			url: server.url,
			location: server.location
		});
		if (addResult) {
			const allServers = await getAllServers();
			return {
				code: 200,
				message: 'Server created!',
				servers: allServers
			};
		}
		return {
			code: 400,
			message: 'Failed to create server.',
			servers: []
		};
	}
);
