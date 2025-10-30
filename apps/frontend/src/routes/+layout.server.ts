import type { RequestEvent } from './$types';

export const load = (req: RequestEvent) => {
	return {
		session: req.locals.session ?? undefined
	};
};
