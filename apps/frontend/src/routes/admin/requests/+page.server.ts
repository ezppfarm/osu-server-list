import { getPendingServerRequests } from '@osu-server-list/db/query';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.session || !locals.session.manage.systemAdmin) return redirect(302, '/');
	const requests = await getPendingServerRequests();
	return { requests };
};
