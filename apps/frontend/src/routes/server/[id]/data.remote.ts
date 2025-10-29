import * as v from 'valibot';
import { query } from '$app/server';
import {
	addServerVote,
	findRecentVoteByIp,
	findRecentVoteByUserId,
	findServerById
} from '@osu-server-list/db/query';
import { getApiHandler } from '@osu-server-list/handlers';
import { validateTurnstileToken } from '@/turnstile';
import { env } from '$env/dynamic/private';
import { sendVoteDataToServer } from '@osu-server-list/hooks';

export const submitVote = query(
	v.object({
		serverId: v.number(),
		userName: v.string(),
		userIp: v.string(),
		captchaToken: v.string(),
		browserFingerprint: v.number()
	}),
	async ({ serverId, userName, userIp, captchaToken, browserFingerprint }) => {
		if (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SECRET_KEY.length > 0) {
			const captchaResult = await validateTurnstileToken({
				ip: userIp,
				secret: env.TURNSTILE_SECRET_KEY,
				token: captchaToken
			});
			if (!captchaResult.success) {
				return {
					success: false,
					message: 'Invalid captcha token'
				};
			}
		}
		if (!userName) {
			return {
				success: false,
				message: 'Missing name parameter'
			};
		}

		const server = await findServerById(serverId);
		if (!server) {
			return {
				success: false,
				message: 'Server not found'
			};
		}

		const recentIpVote = await findRecentVoteByIp(serverId, userIp);
		if (recentIpVote) {
			return {
				success: false,
				message: 'You have already voted for this server in the last 24 hours'
			};
		}

		const apiHandler = getApiHandler(server.url, server.type);
		const userInfo = await apiHandler.fetchUserInfo(userName);
		if (!userInfo) {
			return {
				success: false,
				message: 'User not found on the specified server'
			};
		}

		const recentIdVote = await findRecentVoteByUserId(serverId, userInfo.id);
		if (recentIdVote) {
			return {
				success: false,
				message: 'You have already voted for this server in the last 24 hours'
			};
		}

		const serverVoteDataResult = await sendVoteDataToServer(server, userInfo.id, userInfo.username);

		if (!serverVoteDataResult) {
			return {
				success: false,
				message: 'Failed to submit vote, please try again.'
			};
		}

		await addServerVote(serverId, userIp, userInfo.id, browserFingerprint);

		return {
			success: true,
			message: 'Vote submitted successfully!'
		};
	}
);
