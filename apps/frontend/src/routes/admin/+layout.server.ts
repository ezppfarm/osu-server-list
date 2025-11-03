import { redirect } from '@sveltejs/kit';

export const load = (req) => {
	if (
		!req.locals.session ||
		!req.locals.session.manage.systemAdmin ||
		req.locals.session.manage.manageServers.length <= 0
	)
		return redirect(302, '/');
};
