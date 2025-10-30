CREATE TABLE `server_vote_hook` (
	`server_id` int NOT NULL,
	`postback_url` text,
	`discord_webhook_url` text,
	`discord_webhook_content` text,
	CONSTRAINT `server_vote_hook_server_id` PRIMARY KEY(`server_id`),
	CONSTRAINT `server_vote_hook_server_id_unique` UNIQUE(`server_id`)
);
--> statement-breakpoint
ALTER TABLE `server_vote_hook` ADD CONSTRAINT `server_vote_hook_server_id_server_id_fk` FOREIGN KEY (`server_id`) REFERENCES `server`(`id`) ON DELETE no action ON UPDATE no action;