CREATE TABLE `server` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` text NOT NULL DEFAULT ('BANCHOPY'),
	`name` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`iconUrl` text NOT NULL,
	`tags` text,
	`trending` int NOT NULL,
	`date_added` bigint NOT NULL,
	`location` text,
	CONSTRAINT `server_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `server_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`timestamp` bigint NOT NULL,
	`onlinePlayers` int NOT NULL,
	`registeredPlayers` int NOT NULL,
	`ping` int NOT NULL,
	CONSTRAINT `server_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `server_vote` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serverId` int NOT NULL,
	`userId` int NOT NULL,
	`ip` text NOT NULL,
	`browserFingerprint` int NOT NULL,
	`timestamp` bigint NOT NULL,
	CONSTRAINT `server_vote_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`passwordHash` text NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `server_status` ADD CONSTRAINT `server_status_serverId_server_id_fk` FOREIGN KEY (`serverId`) REFERENCES `server`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `server_vote` ADD CONSTRAINT `server_vote_serverId_server_id_fk` FOREIGN KEY (`serverId`) REFERENCES `server`(`id`) ON DELETE no action ON UPDATE no action;