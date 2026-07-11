import { getServerRequestsByUser, markUserRequestsSeen } from '@osu-server-list/db/query';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.session) return redirect(302, '/');
	const requests = await getServerRequestsByUser(locals.session.user.id);
	await markUserRequestsSeen(locals.session.user.id);
	return { requests };
};
