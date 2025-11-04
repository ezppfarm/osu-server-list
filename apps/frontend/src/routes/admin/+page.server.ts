import { getAllServersWithHooks } from '@osu-server-list/db/query';
import type { ServerFullHook } from '@osu-server-list/db/types';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (
		!locals.session ||
		(locals.session.manage.manageServers.length <= 0 && !locals.session.manage.systemAdmin)
	)
		return redirect(302, '/');
	const servers: ServerFullHook[] = await getAllServersWithHooks();

	const serversToManage: ServerFullHook[] = [];

	if (locals.session.manage.systemAdmin) serversToManage.push(...servers);
	else {
		const userServers = locals.session.manage.manageServers;
		serversToManage.push(
			...servers.filter((server) => userServers.some((userver) => userver.id === server.id))
		);
	}
	return {
		servers: serversToManage
	};
};
