CREATE TABLE `server_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`discordId` varchar(128) NOT NULL,
	`status` enum('PENDING','ACCEPTED','DENIED') NOT NULL DEFAULT 'PENDING',
	`type` enum('BANCHOPY','RIPPLE','TITANIC','SUNRISE','CUSTOM') NOT NULL DEFAULT 'BANCHOPY',
	`name` varchar(255) NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`iconUrl` text NOT NULL,
	`discordUrl` text,
	`tags` text,
	`location` text,
	`denialReason` text,
	`createdServerId` int,
	`submittedAt` bigint NOT NULL,
	`reviewedAt` bigint,
	`seen` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `server_request_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `server_request` ADD CONSTRAINT `server_request_discordId_user_discordId_fk` FOREIGN KEY (`discordId`) REFERENCES `user`(`discordId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `server_request` ADD CONSTRAINT `server_request_createdServerId_server_id_fk` FOREIGN KEY (`createdServerId`) REFERENCES `server`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `request_discord_idx` ON `server_request` (`discordId`);--> statement-breakpoint
CREATE INDEX `request_status_idx` ON `server_request` (`status`);