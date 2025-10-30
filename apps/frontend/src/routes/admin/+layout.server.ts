import { redirect } from '@sveltejs/kit';

export const load = (req) => {
	if (!req.locals.session || !req.locals.session.manage.systemAdmin) return redirect(302, '/');
};
