export type Server = {
  id: number;
  name: string;
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "SUNRISE" | "CUSTOM";
  description: string | null;
  url: string;
  iconUrl: string;
  discordUrl: string | null;
  tags: string | null;
  trending: number;
};

export type ServerFull = {
  id: number;
  name: string;
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "SUNRISE" | "CUSTOM";
  description: string | null;
  url: string;
  iconUrl: string;
  discordUrl: string | null;
  tags: string | null;
  trending: number;
  onlinePlayers: number;
  registeredPlayers: number;
  ping: number;
  votes: number;
  last_update: number | null;
  date_added: number;
  location: string | null;
};

export type ServerFullHook = {
  id: number;
  name: string;
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "SUNRISE" | "CUSTOM";
  description: string | null;
  url: string;
  iconUrl: string;
  discordUrl: string | null;
  tags: string | null;
  trending: number;
  onlinePlayers: number;
  registeredPlayers: number;
  ping: number;
  votes: number;
  last_update: number | null;
  date_added: number;
  location: string | null;
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
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "SUNRISE" | "CUSTOM";
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
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "SUNRISE" | "CUSTOM";
  description: string;
  url: string;
  iconUrl: string;
  discordUrl: string;
  tags: string;
  location: string;
};
