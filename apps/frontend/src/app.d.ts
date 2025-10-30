// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ServerManage } from '@osu-server-list/db/types';
import type { APIUser } from 'discord-api-types/v10';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: {
				user: APIUser;
				manage: ServerManage;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
