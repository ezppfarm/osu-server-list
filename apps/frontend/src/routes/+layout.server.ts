import type { RequestEvent } from './$types';

export const load = (req: RequestEvent) => {
	return {
		pathName: req.url.pathname,
		session: req.locals.session ?? undefined
	};
};
