import type { RequestEvent } from './$types';

export const ssr = true;

export const load = (req: RequestEvent) => {
	return {
		pathName: req.url.pathname,
		session: req.locals.session ?? undefined
	};
};
