import { decrypt, encrypt } from '@/crypto';
import {
	getDiscordSessionFromRefreshToken,
	getDiscordUserFromTokenObject
} from '@osu-server-list/oauth';
import type { Handle } from '@sveltejs/kit';
import type { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { env as pubEnv } from '$env/dynamic/public';
import { env as privEnv } from '$env/dynamic/private';
import dayjs from 'dayjs';
import { getUserManagePermissions } from '@osu-server-list/db/query';

export const handle: Handle = async ({ event, resolve }) => {
	const authenticationCookie = event.cookies.get('auth');
	if (authenticationCookie) {
		try {
			const decryptedOAuthToken = decrypt<RESTPostOAuth2AccessTokenResult>(authenticationCookie);
			const discordUser = await getDiscordUserFromTokenObject(decryptedOAuthToken);
			if (!discordUser) {
				const refreshedOAuthToken = await getDiscordSessionFromRefreshToken(
					decryptedOAuthToken.refresh_token,
					{
						oauthClientId: pubEnv.PUBLIC_DISCORD_CLIENT_ID,
						oauthClientSecret: privEnv.DISCORD_CLIENT_SECRET
					}
				);
				if (refreshedOAuthToken) {
					const refreshedDiscordUser = await getDiscordUserFromTokenObject(refreshedOAuthToken);
					if (refreshedDiscordUser) {
						const serverManage = await getUserManagePermissions(refreshedDiscordUser.id);
						if (serverManage) {
							const encryptedRefreshedDiscordTokenObject =
								encrypt<RESTPostOAuth2AccessTokenResult>(refreshedOAuthToken);
							event.cookies.set('auth', encryptedRefreshedDiscordTokenObject, {
								path: '/',
								httpOnly: true,
								maxAge: dayjs().add(30, 'day').diff(dayjs(), 'second')
							});
							event.locals.session = {
								user: refreshedDiscordUser,
								manage: serverManage
							};
						} else {
							event.cookies.delete('auth', {
								path: '/'
							});
						}
					}
				}
			} else {
				const serverManage = await getUserManagePermissions(discordUser.id);
				if (serverManage) {
					event.cookies.set('auth', authenticationCookie, {
						path: '/',
						httpOnly: true,
						maxAge: dayjs().add(30, 'day').diff(dayjs(), 'second')
					});
					event.locals.session = {
						user: discordUser,
						manage: serverManage
					};
				} else {
					event.cookies.delete('auth', {
						path: '/'
					});
				}
			}
		} catch (err) {
			console.log(err);
			event.cookies.delete('auth', {
				path: '/'
			});
		}
	}

	return await resolve(event);
};
