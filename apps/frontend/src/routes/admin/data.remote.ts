import { query } from '$app/server';
import { deleteServer, getAllServers } from '@osu-server-list/db/query';
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
