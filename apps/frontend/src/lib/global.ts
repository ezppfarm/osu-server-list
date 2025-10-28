import { writable } from 'svelte/store';

export const user = writable<{
	id: number;
	name: string;
}>(undefined);

export const navigationState = writable<'loading' | 'loaded' | null>(null);
