import type { ServerFull } from "./types/serverfull";

export const sortServers = (servers: ServerFull[], sort: string): ServerFull[] => {
    switch (sort) {
        case 'onlinePlayers':
        default:
            return servers.sort((a, b) => {
                if (a.onlinePlayers === -1) return 1;
                if (b.onlinePlayers === -1) return -1;
                return b.onlinePlayers - a.onlinePlayers;
            });
        case 'name':
            return servers.sort((a, b) => a.name.localeCompare(b.name));
        case 'votes':
            return servers.sort((a, b) => b.votes - a.votes);
    }
}

export const getSortName = (sort: string): string => {
    switch (sort) {
        case 'onlinePlayers':
        default:
            return 'Online Users';
        case 'name':
            return 'Name';
        case 'votes':
            return 'Votes';
    }
}