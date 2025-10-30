import { env } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';

const DISCORD_AUTH_URL = 'https://discord.com/oauth2/authorize';

export const GET = ({ url }) => {
	const redirectUri = `${url.protocol}//${url.host}/api/v1/session/authenticate`;

	const authQuery = new URLSearchParams({
		client_id: env.PUBLIC_DISCORD_CLIENT_ID ?? '',
		response_type: 'code',
		scope: 'identify',
		redirect_uri: redirectUri
	});
	const authURL = `${DISCORD_AUTH_URL}?${authQuery.toString()}`;
	return redirect(302, authURL);
};
