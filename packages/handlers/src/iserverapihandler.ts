import type { UserResponse, UsersResponse } from "./types";

export interface IServerApiHandler {
    fetchUserCounts(): Promise<UsersResponse>;
    fetchUserInfo(username: string): Promise<UserResponse | null>;
}