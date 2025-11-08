import * as path from 'path';
import * as fs from 'fs';
import type { RequestEvent } from '../$types.js';
import { getServerById } from '@osu-server-list/db/query';
import { env } from '$env/dynamic/private';

const iconsPath = env.SERVER_LOGO_CACHE_PATH ?? path.join(process.cwd(), 'server_icon_cache');
if (!fs.existsSync(iconsPath)) fs.mkdirSync(iconsPath);

const fallbackImage = Bun.file(path.join(iconsPath, 'fallback.png'));
const fallbackImageData = await fallbackImage.arrayBuffer();

export const GET = async (req: RequestEvent) => {
	const serverId = req.params.id;
	const server = await getServerById(Number(serverId));

	if (!server) {
		return new Response(fallbackImageData, {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	}

	if (!server.iconUrl || server.iconUrl.trim().length <= 0) {
		return new Response(fallbackImageData, {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	}

	const fileList = fs.readdirSync(iconsPath);
	const cachedServerIcon = fileList.find((icon) => icon.startsWith(`${serverId}_`));

	if (cachedServerIcon) {
		const cacheDate = cachedServerIcon.split('_')[1];
		const shouldRecache = Date.now() - Number(cacheDate) >= 1000 * 60 * 60;
		if (!shouldRecache) {
			const imageFile = Bun.file(path.join(iconsPath, cachedServerIcon));
			const imageData = await imageFile.arrayBuffer();
			return new Response(imageData, {
				headers: {
					'Content-Type': imageFile.type
				}
			});
		}
	}
	const fileExtension = server.iconUrl.split('.').pop();
	const fileName = `${serverId}_${Date.now()}.${fileExtension}`;

	try {
		const response = await fetch(server.iconUrl);
		if (
			response.status !== 200 ||
			!response.ok ||
			!response.headers.get('Content-Type')?.includes('image')
		)
			return new Response(fallbackImageData, {
				headers: {
					'Content-Type': 'image/png'
				}
			});
		const imageData = await response.arrayBuffer();
		await Bun.write(path.join(iconsPath, fileName), imageData);
		return new Response(imageData, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') ?? 'image/png' //use image/png as fallback for now
			}
		});
	} catch {
		return new Response(fallbackImageData, {
			headers: {
				'Content-Type': 'image/png'
			}
		});
	}
};
