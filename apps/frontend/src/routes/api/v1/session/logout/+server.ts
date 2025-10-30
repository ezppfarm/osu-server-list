import { env as pubEnv } from '$env/dynamic/public';
import { env as privEnv } from '$env/dynamic/private';
import { invalidateDiscordToken } from '@osu-server-list/oauth';
import { redirect } from '@sveltejs/kit';
import { decrypt } from '@/crypto.js';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

export const GET = async ({ cookies }) => {
	const authenticationCookie = cookies.get('auth');
	if (authenticationCookie) {
		const decryptedOAuthToken = decrypt<RESTPostOAuth2AccessTokenResult>(authenticationCookie);
		if (decryptedOAuthToken) {
			await invalidateDiscordToken(decryptedOAuthToken, {
				oauthClientId: pubEnv.PUBLIC_DISCORD_CLIENT_ID,
				oauthClientSecret: privEnv.DISCORD_CLIENT_SECRET
			});
		}
		cookies.delete('auth', {
			path: '/'
		});
	}
	return redirect(302, '/');
};
