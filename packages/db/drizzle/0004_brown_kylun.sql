ALTER TABLE `server` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX `name_idx` ON `server` (`name`);--> statement-breakpoint
CREATE INDEX `server_timestamp_idx` ON `server_status` (`serverId`,`timestamp`);--> statement-breakpoint
CREATE INDEX `online_players_idx` ON `server_status` (`onlinePlayers`);--> statement-breakpoint
CREATE INDEX `server_idx` ON `server_vote` (`serverId`);