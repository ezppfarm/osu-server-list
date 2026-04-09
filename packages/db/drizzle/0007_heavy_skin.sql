DROP INDEX `server_timestamp_idx` ON `server_status`;--> statement-breakpoint
DROP INDEX `server_idx` ON `server_vote`;--> statement-breakpoint
CREATE INDEX `server_timestamp_ping_idx` ON `server_status` (`serverId`,`timestamp`,`ping`);--> statement-breakpoint
CREATE INDEX `server_timestamp_idx` ON `server_vote` (`serverId`,`timestamp`);