import { redirect } from '@sveltejs/kit';

export const load = (req) => {
	if (
		!req.locals.session ||
		(req.locals.session.manage.manageServers.length <= 0 && !req.locals.session.manage.systemAdmin)
	)
		return redirect(302, '/');
};
