CREATE TYPE "public"."request_status" AS ENUM('PENDING', 'ACCEPTED', 'DENIED');--> statement-breakpoint
CREATE TYPE "public"."server_type" AS ENUM('BANCHOPY', 'RIPPLE', 'TITANIC', 'SUNRISE', 'CUSTOM');--> statement-breakpoint
CREATE TABLE "server" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "server_type" DEFAULT 'BANCHOPY' NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"iconUrl" text NOT NULL,
	"discordUrl" text,
	"tags" text,
	"trending" integer NOT NULL,
	"date_added" bigint NOT NULL,
	"location" text
);
--> statement-breakpoint
CREATE TABLE "server_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"discordId" varchar(128) NOT NULL,
	"status" "request_status" DEFAULT 'PENDING' NOT NULL,
	"type" "server_type" DEFAULT 'BANCHOPY' NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"iconUrl" text NOT NULL,
	"discordUrl" text,
	"tags" text,
	"location" text,
	"denialReason" text,
	"createdServerId" integer,
	"submittedAt" bigint NOT NULL,
	"reviewedAt" bigint,
	"seen" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"serverId" integer NOT NULL,
	"timestamp" bigint NOT NULL,
	"onlinePlayers" integer NOT NULL,
	"registeredPlayers" integer NOT NULL,
	"ping" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"serverId" integer NOT NULL,
	"userId" integer NOT NULL,
	"ip" text NOT NULL,
	"browserFingerprint" bigint NOT NULL,
	"timestamp" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "server_vote_hook" (
	"server_id" integer PRIMARY KEY NOT NULL,
	"postback_url" text,
	"discord_webhook_url" text,
	"discord_webhook_content" text,
	CONSTRAINT "server_vote_hook_server_id_unique" UNIQUE("server_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"discordId" varchar(128) PRIMARY KEY NOT NULL,
	"systemAdmin" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_server_manage" (
	"discordId" varchar(128) NOT NULL,
	"serverId" integer NOT NULL,
	CONSTRAINT "user_server_manage_discordId_serverId_pk" PRIMARY KEY("discordId","serverId")
);
--> statement-breakpoint
ALTER TABLE "server_request" ADD CONSTRAINT "server_request_discordId_user_discordId_fk" FOREIGN KEY ("discordId") REFERENCES "public"."user"("discordId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_request" ADD CONSTRAINT "server_request_createdServerId_server_id_fk" FOREIGN KEY ("createdServerId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_status" ADD CONSTRAINT "server_status_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_vote" ADD CONSTRAINT "server_vote_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_vote_hook" ADD CONSTRAINT "server_vote_hook_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_server_manage" ADD CONSTRAINT "user_server_manage_discordId_user_discordId_fk" FOREIGN KEY ("discordId") REFERENCES "public"."user"("discordId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_server_manage" ADD CONSTRAINT "user_server_manage_serverId_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."server"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_idx" ON "server" USING btree ("name");--> statement-breakpoint
CREATE INDEX "request_discord_submitted_idx" ON "server_request" USING btree ("discordId","submittedAt");--> statement-breakpoint
CREATE INDEX "request_status_submitted_idx" ON "server_request" USING btree ("status","submittedAt");--> statement-breakpoint
CREATE INDEX "request_discord_seen_idx" ON "server_request" USING btree ("discordId","seen");--> statement-breakpoint
CREATE INDEX "request_created_server_idx" ON "server_request" USING btree ("createdServerId");--> statement-breakpoint
CREATE INDEX "server_status_server_timestamp_idx" ON "server_status" USING btree ("serverId","timestamp");--> statement-breakpoint
CREATE INDEX "server_vote_server_timestamp_idx" ON "server_vote" USING btree ("serverId","timestamp");--> statement-breakpoint
CREATE INDEX "server_vote_ip_timestamp_idx" ON "server_vote" USING btree ("ip","timestamp");--> statement-breakpoint
CREATE INDEX "server_vote_user_server_timestamp_idx" ON "server_vote" USING btree ("userId","serverId","timestamp");--> statement-breakpoint
CREATE INDEX "server_vote_browser_timestamp_idx" ON "server_vote" USING btree ("browserFingerprint","timestamp");--> statement-breakpoint
CREATE INDEX "user_server_manage_server_idx" ON "user_server_manage" USING btree ("serverId");