import { getAllServers } from '@osu-server-list/db/query';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const GET = async (_req: RequestEvent) => {
	const servers = await getAllServers();
	return json(servers);
};
