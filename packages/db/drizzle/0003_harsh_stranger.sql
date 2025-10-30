CREATE TABLE `user_server_manage` (
	`discordId` varchar(128) NOT NULL,
	`serverId` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `user` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `name`;
ALTER TABLE `user` MODIFY COLUMN `discordId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD PRIMARY KEY(`discordId`);--> statement-breakpoint
ALTER TABLE `user` ADD `systemAdmin` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `user_server_manage` ADD CONSTRAINT `user_server_manage_discordId_user_discordId_fk` FOREIGN KEY (`discordId`) REFERENCES `user`(`discordId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_server_manage` ADD CONSTRAINT `user_server_manage_serverId_server_id_fk` FOREIGN KEY (`serverId`) REFERENCES `server`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint