import * as path from 'path';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import type { RequestEvent } from '../$types.js';
import { getServerById } from '@osu-server-list/db/query';
import { env } from '$env/dynamic/private';

const iconsPath = env.SERVER_LOGO_CACHE_PATH || path.join(process.cwd(), 'server_icon_cache');

if (!existsSync(iconsPath)) {
	await fs.mkdir(iconsPath, { recursive: true });
}

const fallbackImage = Bun.file(path.join(iconsPath, 'fallback.png'));

const cacheDuration = 1000 * 60 * 60;
const downloads = new Map<number, Promise<Response>>();

const contentTypeToExtension: Record<string, string> = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/webp': 'webp',
	'image/gif': 'gif',
	'image/svg+xml': 'svg',
	'image/x-icon': 'ico',
	'image/vnd.microsoft.icon': 'ico',
	'image/avif': 'avif'
};

const getFallbackResponse = () =>
	new Response(fallbackImage, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600'
		}
	});

const getCacheHeaders = (contentType: string) => ({
	'Content-Type': contentType,
	'Cache-Control': 'public, max-age=3600'
});

const getCachedIcon = async (serverId: number) => {
	const files = await fs.readdir(iconsPath);

	for (const file of files) {
		if (!file.startsWith(`${serverId}.`)) {
			continue;
		}

		const filePath = path.join(iconsPath, file);
		const stat = await fs.stat(filePath);

		if (Date.now() - stat.mtimeMs >= cacheDuration) {
			await fs.rm(filePath, { force: true });
			return null;
		}

		return Bun.file(filePath);
	}

	return null;
};

export const GET = async (req: RequestEvent) => {
	const serverId = Number(req.params.id);

	if (!Number.isFinite(serverId)) {
		return getFallbackResponse();
	}

	const server = await getServerById(serverId);

	if (!server || !server.iconUrl?.trim()) {
		return getFallbackResponse();
	}

	try {
		const url = new URL(server.iconUrl);

		if (!['http:', 'https:'].includes(url.protocol)) {
			return getFallbackResponse();
		}
	} catch {
		return getFallbackResponse();
	}

	const cachedIcon = await getCachedIcon(serverId);

	if (cachedIcon) {
		return new Response(cachedIcon, {
			headers: getCacheHeaders(cachedIcon.type || 'image/png')
		});
	}

	const existingDownload = downloads.get(serverId);

	if (existingDownload) {
		return existingDownload;
	}

	const download = (async () => {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10000);

		try {
			const response = await fetch(server.iconUrl, {
				signal: controller.signal,
				redirect: 'follow'
			});

			const contentType = response.headers.get('Content-Type')?.split(';')[0] ?? '';

			if (!response.ok || !contentType.startsWith('image/')) {
				return getFallbackResponse();
			}

			const extension = contentTypeToExtension[contentType] ?? 'png';

			const finalPath = path.join(iconsPath, `${serverId}.${extension}`);
			const tempPath = `${finalPath}.tmp`;

			const imageData = await response.arrayBuffer();

			await Bun.write(tempPath, imageData);
			await fs.rename(tempPath, finalPath);

			return new Response(Bun.file(finalPath), {
				headers: getCacheHeaders(contentType)
			});
		} catch {
			return getFallbackResponse();
		} finally {
			clearTimeout(timeout);
			downloads.delete(serverId);
		}
	})();

	downloads.set(serverId, download);

	return download;
};
