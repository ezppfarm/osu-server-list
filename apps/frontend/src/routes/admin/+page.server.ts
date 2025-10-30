import { getAllServers } from '@osu-server-list/db/query';

export const load = async () => {
	const servers = await getAllServers();

	return {
		servers
	};
};
