import * as path from 'path';
import * as fs from 'fs';
import type { RequestEvent } from '../$types.js';
import { getServerById } from '@osu-server-list/db/query';
import { text } from '@sveltejs/kit';

const iconsPath = path.join(process.cwd(), 'server_icon_cache');
if (!fs.existsSync(iconsPath)) fs.mkdirSync(iconsPath);

export const GET = async (req: RequestEvent) => {
	const serverId = req.params.id;
	const server = await getServerById(Number(serverId));

	if (!server) {
		console.log('Server not found');
		return text('Server not found');
	}

	if (!server.iconUrl || server.iconUrl.trim().length <= 0) {
		console.log('Server has no icon');
		return text('Server has no icon');
	}

	const fileList = fs.readdirSync(iconsPath);

	const cachedServerIcon = fileList.find((icon) => icon.startsWith(`${serverId}_`));

	if (cachedServerIcon) {
		const cacheDate = cachedServerIcon.split('_')[1];
		const shouldRecache = Date.now() - Number(cacheDate) >= 1000 * 60 * 60;
		if (!shouldRecache) {
			const imageFile = Bun.file(path.join(iconsPath, cachedServerIcon));
			const imageData = await imageFile.arrayBuffer();
			console.log('Used cached server icon');
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
			return text('Server has no icon');
		const imageData = await response.arrayBuffer();
		await Bun.write(path.join(iconsPath, fileName), imageData);
		console.log('Recached server icon');
		return new Response(imageData, {
			headers: {
				'Content-Type': response.headers.get('Content-Type') ?? 'image/png' //use image/png as fallback for now
			}
		});
	} catch {
		console.log('Failed to fetch server icon');
		return text('Server has no icon');
	}
};
