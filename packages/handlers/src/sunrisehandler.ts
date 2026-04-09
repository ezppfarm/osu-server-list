import { betterFetch } from "@better-fetch/fetch";
import type { UserResponse, UsersResponse } from "./types";
import type { IServerApiHandler } from "./iserverapihandler";

type SunriseUsersResponse = {
  is_online: boolean;
  is_on_maintenance: boolean;
  users_online: number;
  total_users: number;
};

type SunriseUserInfoResponse = {
  user_id: number;
  username: string;
};

export class SunriseApiHandler implements IServerApiHandler {
  constructor(
    private baseUrl: string,
  ) { }

  private async makeRequest<T>(
    endpoint: string,
    params?: any,
  ): Promise<T | null> {
    try {
      const apiUrl = this.baseUrl.replace("https://", "https://api.");

      const url = `${apiUrl}${endpoint}`;
      const response = await betterFetch<T>(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        query: params,
        throw: false,
      });

      if (response.error) {
        if (response.error.status === 404) {
          return null;
        }

        throw new Error(
          `Request to ${url} resulted in status code ${response.error.status} - ${response.error.statusText}`,
        );
      }

      return response.data;
    } catch {
      return null;
    }
  }

  public async fetchUserCounts(): Promise<UsersResponse> {
    const data = await this.makeRequest<SunriseUsersResponse>("/status");

    if (!data || !data.is_online) {
      /* throw new Error("Failed to fetch user counts"); */
      return { onlineCount: -1, totalCount: -1 };
    }

    return {
      onlineCount: Math.max(data.users_online - 1, 0), // account for the bot
      totalCount: data.total_users,
    };
  }

  public async fetchUserInfo(username: string): Promise<UserResponse | null> {
    const data = await this.makeRequest<SunriseUserInfoResponse[]>(
      `/user/search`,
      {
        query: username,
      },
    );

    if (!data || !data[0]) {
      return null;
    }

    return {
      id: data[0].user_id,
      username: data[0].username,
    };
  }
}
