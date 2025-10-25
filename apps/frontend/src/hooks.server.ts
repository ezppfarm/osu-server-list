import { decrypt } from '@/crypto';
import { getUser } from '@osu-server-list/db/query';
import type { Handle, RequestEvent } from '@sveltejs/kit';

const auth = async (event: RequestEvent) => {
	const encryptedSession = event.cookies.get('session') ?? '';
	if (encryptedSession) {
		const decryptedSession = decrypt(encryptedSession);
		const [, name, passwordHash] = decryptedSession.split(':');
		const user = await getUser(name, passwordHash);
		if (user) {
			event.locals.user = {
				id: user.id,
				name: user.name
			};
			event.cookies.set('session', encryptedSession, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/',
				maxAge: 3600 // 1 hour expiration
			});
		} else {
			event.cookies.delete('session', { path: '/' });
		}
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	await auth(event);
	return await resolve(event);
};
