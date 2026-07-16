export type ServerType =
  "BANCHOPY" | "RIPPLE" | "TITANIC" | "SUNRISE" | "CUSTOM";

export type Server = {
  id: number;
  name: string;
  type: ServerType;
  description: string | null;
  url: string;
  iconUrl: string;
  tags: string | null;
  trending: number;
};

export type ServerFull = Server & {
  discordUrl: string | null;
  onlinePlayers: number;
  registeredPlayers: number;
  ping: number;
  votes: number;
  last_update: number | null;
  date_added: number;
  location: string | null;
};

export type ServerFullHook = ServerFull & {
  postbackUrl: string;
  discordWebhookUrl: string;
  discordWebhookContent: string;
};

export type ServerManage = {
  systemAdmin: boolean;
  manageServers: Server[];
};

export type ServerRequestStatus = "PENDING" | "ACCEPTED" | "DENIED";

export type ServerRequest = {
  id: number;
  discordId: string;
  status: ServerRequestStatus;
  type: ServerType;
  name: string;
  description: string | null;
  url: string;
  iconUrl: string;
  discordUrl: string | null;
  tags: string | null;
  location: string | null;
  denialReason: string | null;
  createdServerId: number | null;
  submittedAt: number;
  reviewedAt: number | null;
  seen: number;
};

export type ServerRequestInput = {
  name: string;
  type: ServerType;
  description: string;
  url: string;
  iconUrl: string;
  discordUrl: string;
  tags: string;
  location: string;
};
