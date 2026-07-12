import { resolve } from "$app/paths";
import type { ResolvedPathname } from "$app/types";

export const navEntries: {
	name: string;
	href: ResolvedPathname;
	activeRegex: RegExp[];
	subEntries?: {
		name: string;
		href: ResolvedPathname;
	}[];
}[] = [
	{
		name: 'Servers',
		href: resolve("/"),
		activeRegex: [/^\/$/]
	}
];
