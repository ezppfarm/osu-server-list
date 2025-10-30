import { env as pubEnv } from '$env/dynamic/public';
import { env as privEnv } from '$env/dynamic/private';
import {
	getDiscordSessionFromURLRequest,
	getDiscordUserFromTokenObject
} from '@osu-server-list/oauth';
import { redirect } from '@sveltejs/kit';
import { encrypt } from '@/crypto.js';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import dayjs from 'dayjs';
import { addUser } from '@osu-server-list/db/query';

export const GET = async ({ url, cookies }) => {
	const redirectUri = `${url.protocol}//${url.host}/api/v1/session/authenticate`;

	console.log(redirectUri);

	const oauthResponse = await getDiscordSessionFromURLRequest(url, {
		oauthClientId: pubEnv.PUBLIC_DISCORD_CLIENT_ID ?? '',
		oauthClientSecret: privEnv.DISCORD_CLIENT_SECRET ?? '',
		redirectUrl: redirectUri
	});
	console.log(oauthResponse);
	if (oauthResponse) {
		const discordUser = await getDiscordUserFromTokenObject(oauthResponse);
		if (discordUser) {
			const encryptedDiscordTokenObject = encrypt<RESTPostOAuth2AccessTokenResult>(oauthResponse);
			cookies.set('auth', encryptedDiscordTokenObject, {
				path: '/',
				httpOnly: true,
				maxAge: dayjs().add(30, 'day').diff(dayjs(), 'second')
			});
			await addUser(discordUser.id);
		}
	}
	return redirect(302, '/');
};
