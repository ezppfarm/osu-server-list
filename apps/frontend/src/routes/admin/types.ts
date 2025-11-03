export type ServerAdd = {
	name: string;
	description: string;
	iconUrl: string;
	tags: string;
	trending: boolean;
	url: string;
	location: string;
};

export type ServerEdit = {
	id: number;
	name: string;
	description: string;
	iconUrl: string;
	tags: string;
	trending: boolean;
	url: string;
	location: string;
};
