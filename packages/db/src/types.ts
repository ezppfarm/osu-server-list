export type Server = {
  id: number;
  name: string;
  description?: string;
  url: string;
  iconUrl: string;
  tags?: string;
  trending: number;
};

export type ServerFull = {
  id: number;
  name: string;
  type: "BANCHOPY" | "RIPPLE" | "TITANIC" | "CUSTOM";
  description: string | null;
  url: string;
  iconUrl: string;
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
