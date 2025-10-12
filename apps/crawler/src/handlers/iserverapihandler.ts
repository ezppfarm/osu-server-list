import type { UsersResponse } from "../types";

export interface IServerApiHandler {
    fetchUserCounts(): Promise<UsersResponse>;
}