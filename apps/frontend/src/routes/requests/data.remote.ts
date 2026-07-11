import { query, getRequestEvent } from '$app/server';
import {
	addServerRequest,
	getAllServersRaw,
	getServerRequestsByUser
} from '@osu-server-list/db/query';
import { validateTurnstileToken } from '@/turnstile';
import { getClientIP } from '@/ip';
import { env } from '$env/dynamic/private';
import * as v from 'valibot';

const discordUrlRegex =
	/^(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/i;

export const submitServerRequest = query(
	v.object({
		name: v.string(),
		type: v.string(),
		description: v.string(),
		url: v.string(),
		iconUrl: v.string(),
		discordUrl: v.string(),
		tags: v.string(),
		location: v.string(),
		captchaToken: v.string()
	}),
	async (input) => {
		const event = getRequestEvent();
		const session = event.locals.session;
		if (!session) {
			return { success: false, message: 'You must be logged in.', requests: [] };
		}

		if (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SECRET_KEY.length > 0) {
			const captchaResult = await validateTurnstileToken({
				ip: getClientIP(event.request),
				secret: env.TURNSTILE_SECRET_KEY,
				token: input.captchaToken
			});
			if (!captchaResult.success) {
				return { success: false, message: 'Invalid captcha token', requests: [] };
			}
		}

		if (input.name.trim().length <= 0)
			return { success: false, message: 'Name cannot be empty', requests: [] };
		if (input.url.trim().length <= 0)
			return { success: false, message: 'URL cannot be empty', requests: [] };
		if (input.iconUrl.trim().length <= 0)
			return { success: false, message: 'Icon URL cannot be empty', requests: [] };
		if (input.tags.trim().length <= 0)
			return { success: false, message: 'Tags cannot be empty', requests: [] };
		if (input.discordUrl.trim().length > 0 && !input.discordUrl.match(discordUrlRegex))
			return { success: false, message: 'Invalid Discord invite URL', requests: [] };

		const existing = await getAllServersRaw();
		if (existing.some((s) => s.url === input.url || s.name === input.name)) {
			return {
				success: false,
				message: 'A server with that name or URL already exists.',
				requests: []
			};
		}

		const added = await addServerRequest(session.user.id, {
			name: input.name,
			type: input.type as 'BANCHOPY' | 'RIPPLE' | 'TITANIC' | 'SUNRISE' | 'CUSTOM',
			description: input.description,
			url: input.url,
			iconUrl: input.iconUrl,
			discordUrl: input.discordUrl,
			tags: input.tags,
			location: input.location
		});
		if (!added) {
			return { success: false, message: 'Failed to submit request.', requests: [] };
		}

		const requests = await getServerRequestsByUser(session.user.id);
		return { success: true, message: 'Request submitted!', requests };
	}
);
