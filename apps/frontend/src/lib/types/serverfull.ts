export type ServerFull = {
  id: number;
  name: string;
  type: "BANCHOPY" | "RIPPLE" | "CUSTOM";
  description: string | null;
  url: string;
  iconUrl: string;
  tags: string | null;
  trending: number;
  onlinePlayers: number;
  registeredPlayers: number;
  votes: number;
  last_update: number | null;
};