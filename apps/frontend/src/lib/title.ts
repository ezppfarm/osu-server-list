import { env } from '$env/dynamic/public';
import { writable } from 'svelte/store';

function createTitle() {
	const { subscribe, set } = writable(`loading... - ${env.PUBLIC_APP_NAME}`);

	return {
		subscribe,
		set: (value: string) => {
			set(`${value} - ${env.PUBLIC_APP_NAME}`);
		}
	};
}

export const title = createTitle();
