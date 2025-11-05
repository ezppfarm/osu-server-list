export const navEntries: {
	name: string;
	href?: string;
	activeRegex: RegExp[];
	subEntries?: {
		name: string;
		href: string;
	}[];
}[] = [
	{
		name: 'Servers',
		href: '/',
		activeRegex: [/^\/$/]
	}
];
