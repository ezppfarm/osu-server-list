import { query, getRequestEvent } from '$app/server';
import {
	acceptServerRequest,
	denyServerRequest,
	getPendingServerRequests,
	getServerRequestById
} from '@osu-server-list/db/query';
import * as v from 'valibot';

const requireAdmin = () => {
	const event = getRequestEvent();
	return event.locals.session?.manage.systemAdmin ? event.locals.session : null;
};

export const getPendingRequests = query(async () => {
	if (!requireAdmin()) return { success: false, message: 'Unauthorized', requests: [] };
	const requests = await getPendingServerRequests();
	return { success: true, message: '', requests };
});

export const acceptRequest = query(
	v.object({
		id: v.number(),
		name: v.string(),
		type: v.string(),
		description: v.string(),
		iconUrl: v.string(),
		tags: v.string(),
		trending: v.boolean(),
		url: v.string(),
		discordUrl: v.string(),
		location: v.string()
	}),
	async (input) => {
		if (!requireAdmin()) return { success: false, message: 'Unauthorized', requests: [] };
		const request = await getServerRequestById(input.id);
		if (!request || request.status !== 'PENDING') {
			return { success: false, message: 'Request not found or already reviewed.', requests: [] };
		}
		const accepted = await acceptServerRequest(input.id, {
			name: input.name,
			type: input.type as 'BANCHOPY' | 'RIPPLE' | 'TITANIC' | 'SUNRISE' | 'CUSTOM',
			description: input.description,
			iconUrl: input.iconUrl,
			tags: input.tags,
			trending: input.trending,
			url: input.url,
			discordUrl: input.discordUrl,
			location: input.location
		});
		if (!accepted) return { success: false, message: 'Failed to accept request.', requests: [] };
		const requests = await getPendingServerRequests();
		return { success: true, message: 'Request accepted!', requests };
	}
);

export const denyRequest = query(
	v.object({ id: v.number(), reason: v.string() }),
	async (input) => {
		if (!requireAdmin()) return { success: false, message: 'Unauthorized', requests: [] };
		if (input.reason.trim().length <= 0) {
			return { success: false, message: 'A denial reason is required.', requests: [] };
		}
		const request = await getServerRequestById(input.id);
		if (!request || request.status !== 'PENDING') {
			return { success: false, message: 'Request not found or already reviewed.', requests: [] };
		}
		const denied = await denyServerRequest(input.id, input.reason);
		if (!denied) return { success: false, message: 'Failed to deny request.', requests: [] };
		const requests = await getPendingServerRequests();
		return { success: true, message: 'Request denied.', requests };
	}
);
