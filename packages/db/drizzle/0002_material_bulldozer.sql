ALTER TABLE `user` RENAME COLUMN `passwordHash` TO `discordId`;--> statement-breakpoint
ALTER TABLE `server_vote` MODIFY COLUMN `browserFingerprint` bigint NOT NULL;