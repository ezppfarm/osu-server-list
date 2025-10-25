import type { RequestEvent } from './$types';

export const load = (req: RequestEvent) => {
	return {
		user: req.locals.user || null
	};
};
