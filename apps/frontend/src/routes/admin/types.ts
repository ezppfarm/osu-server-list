export type ServerAdd = {
	name: string;
	type: 'RIPPLE' | 'BANCHOPY' | 'TITANIC' | 'CUSTOM';
	description: string;
	iconUrl: string;
	tags: string;
	trending: boolean;
	url: string;
	location: string;
	postbackUrl: string;
	discordWebhookUrl: string;
	discordWebhookContent: string;
};

export type ServerEdit = {
	id: number;
	name: string;
	type: 'RIPPLE' | 'BANCHOPY' | 'TITANIC' | 'CUSTOM';
	description: string;
	iconUrl: string;
	tags: string;
	trending: boolean;
	url: string;
	location: string;
	postbackUrl: string;
	discordWebhookUrl: string;
	discordWebhookContent: string;
};
