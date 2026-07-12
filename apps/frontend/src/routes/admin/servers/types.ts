export type ServerAdd = {
	name: string;
	type: 'RIPPLE' | 'BANCHOPY' | 'TITANIC' | 'SUNRISE' | 'CUSTOM';
	description: string;
	iconUrl: string;
	tags: string;
	trending: boolean;
	url: string;
	discordUrl: string;
	location: string;
	postbackUrl: string;
	discordWebhookUrl: string;
	discordWebhookContent: string;
};

export type ServerEdit = {
	id: number;
	name: string;
	type: 'RIPPLE' | 'BANCHOPY' | 'TITANIC' | 'SUNRISE' | 'CUSTOM';
	description: string;
	iconUrl: string;
	tags: string;
	trending: boolean;
	url: string;
	discordUrl: string;
	location: string;
	postbackUrl: string;
	discordWebhookUrl: string;
	discordWebhookContent: string;
};
