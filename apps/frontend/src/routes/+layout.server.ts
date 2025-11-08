import type { MetaTagsProps } from 'svelte-meta-tags';
import type { RequestEvent } from './$types';
import { env } from '$env/dynamic/public';

export const ssr = true;

export const load = (req: RequestEvent) => {
	const baseMetaTags = Object.freeze({
		robots: true,
		title: `${env.PUBLIC_APP_NAME} - Your Gateway to osu! Communities`,
		description:
			'Browse, compare, and join thriving osu! private servers. Find communities with custom features, unique gameplay modes, and active player bases.',
		keywords: [
			'osu',
			'osu!',
			'private server',
			'osu private servers',
			'osu! private servers',
			'osu communities',
			'osu! communities',
			'osu server list',
			'osu! server list',
			'private servers',
			'rhythm game',
			'community',
			'multiplayer',
			'custom features',
			'gameplay modes'
		],
		twitter: {
			title: `${env.PUBLIC_APP_NAME} - Your Gateway to osu! Communities`,
			image: `${req.url.protocol}//${req.url.host}/logo.png`,
			description:
				'Browse, compare, and join thriving osu! private servers. Find communities with custom features, unique gameplay modes, and active player bases.'
		},
		canonical: req.url.href,
		openGraph: {
			type: 'website',
			url: req.url.href,
			locale: 'en_US',
			siteName: env.PUBLIC_APP_NAME,
			title: `${env.PUBLIC_APP_NAME} - Your Gateway to osu! Communities`,
			description:
				'Browse, compare, and join thriving osu! private servers. Find communities with custom features, unique gameplay modes, and active player bases.',
			images: [
				{
					url: `${req.url.protocol}//${req.url.host}/logo.png`
				}
			]
		}
	}) satisfies MetaTagsProps;

	return {
		baseMetaTags,
		pathName: req.url.pathname,
		session: req.locals.session ?? undefined
	};
};
