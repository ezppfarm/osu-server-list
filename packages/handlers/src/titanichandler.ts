import { betterFetch } from "@better-fetch/fetch";
import type { UserResponse, UsersResponse } from "./types";
import type { IServerApiHandler } from "./iserverapihandler";

type TitanicStatsResponse = {
  online_users: number;
  total_users: number;
};

type TitanicUserInfoResponse = {
  id: number;
  name: string;
};

export class TitanicApiHandler implements IServerApiHandler {
  constructor(
    private baseUrl: string,
    private useOldApiFormat: boolean = false,
  ) {}

  private async makeRequest<T>(
    endpoint: string,
    params?: any,
  ): Promise<T | null> {
    const apiUrl = this.baseUrl.replace("https://osu.", "https://api.");

    const url = `${apiUrl}${endpoint}`;
    const response = await betterFetch<T>(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      query: params,
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
  }

  public async fetchUserCounts(): Promise<UsersResponse> {
    const data = await this.makeRequest<TitanicStatsResponse>("/stats");

    if (!data) {
      throw new Error("Failed to fetch user counts");
    }

    return {
      onlineCount: data.online_users,
      totalCount: data.total_users,
    };
  }

  public async fetchUserInfo(username: string): Promise<UserResponse | null> {
    const data = await this.makeRequest<TitanicUserInfoResponse>(
      `/users/lookup/${username}`,
    );

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      username: data.name,
    };
  }
}
